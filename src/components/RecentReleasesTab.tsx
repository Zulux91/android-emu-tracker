import { useMemo } from 'react'
import type { RankingsData, ProjectResult, Release } from '../types/rankings'
import type { TranslationKeys } from '../i18n/en'
import { formatNumber, timeAgo, isWithinDays } from '../utils/formatters'
import { getCategoryPillClass, getValidAssets } from '../utils/assetFilters'

interface Props {
  data: RankingsData
  onProjectClick: (p: ProjectResult) => void
  t: (section: keyof TranslationKeys, key: string) => string
}

interface RecentEntry {
  project: ProjectResult
  release: Release
  validAssets: ReturnType<typeof getValidAssets>
}

export default function RecentReleasesTab({ data, onProjectClick, t }: Props) {
  const entries = useMemo<RecentEntry[]>(() => {
    const result: RecentEntry[] = []
    for (const project of data.results) {
      if (project.category === 'Drivers') continue
      for (const release of project.releases) {
        if (!isWithinDays(release.date, 30)) continue
        const validAssets = getValidAssets(release.assets, project.extensions)
        if (validAssets.length === 0) continue
        result.push({ project, release, validAssets })
      }
    }
    return result.sort((a, b) => new Date(b.release.date).getTime() - new Date(a.release.date).getTime())
  }, [data])

  return (
    <div className="tab-section">
      <div className="tab-section-header">
        <h2 className="tab-section-title">{t('recentReleases', 'title')}</h2>
        <p className="tab-section-subtitle text-muted">{t('recentReleases', 'subtitle')}</p>
      </div>

      {entries.length === 0 ? (
        <p className="empty-state">{t('recentReleases', 'noReleases')}</p>
      ) : (
        <div className="release-feed">
          {entries.map(({ project, release, validAssets }) => {
            const isHot = isWithinDays(release.date, 7)
            return (
              <div
                key={`${project.repo}-${release.tag}`}
                className="feed-card glass-card"
                onClick={() => onProjectClick(project)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onProjectClick(project)}
                aria-label={`${project.name} ${release.tag}`}
              >
                <div className="feed-card-header">
                  <div className="feed-card-meta">
                    <span className="feed-project-name">{project.name}</span>
                    <span className={`category-pill ${getCategoryPillClass(project.category)}`}>
                      {project.category}
                    </span>
                    {isHot
                      ? <span className="badge-new badge-hot">{t('recentReleases', 'hot')}</span>
                      : <span className="badge-new">{t('recentReleases', 'new')}</span>
                    }
                  </div>
                  <span className="feed-time text-muted">{timeAgo(release.date)}</span>
                </div>

                <div className="feed-card-body">
                  <div className="feed-release-info">
                    <span className="release-tag">{release.tag}</span>
                    {release.name && release.name !== release.tag && (
                      <span className="release-name text-muted">{release.name}</span>
                    )}
                    <span className="text-cyan">{formatNumber(release.downloads)} ↓</span>
                  </div>
                </div>

                <div className="feed-assets" onClick={e => e.stopPropagation()}>
                  {validAssets.map(asset => (
                    <a
                      key={asset.name}
                      className="btn btn-download feed-dl-btn"
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t('recentReleases', 'download')} ${asset.name}`}
                    >
                      {asset.name.length > 30 ? asset.name.slice(0, 28) + '…' : asset.name} ↓
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
