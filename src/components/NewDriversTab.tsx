import { useMemo } from 'react'
import type { RankingsData, ProjectResult, Release } from '../types/rankings'
import type { TranslationKeys } from '../i18n/en'
import { formatNumber, timeAgo, isWithinDays } from '../utils/formatters'
import { getValidAssets } from '../utils/assetFilters'

interface Props {
  data: RankingsData
  onProjectClick: (p: ProjectResult) => void
  t: (section: keyof TranslationKeys, key: string) => string
}

interface DriverEntry {
  project: ProjectResult
  release: Release
}

function DriverLogo({ logo }: { logo?: string }) {
  if (logo) {
    return <img src={`./logos/${logo}`} alt="" className="project-logo" loading="lazy" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
  }
  return <div className="project-logo-fallback" aria-hidden="true">⚙</div>
}

export default function NewDriversTab({ data, onProjectClick, t }: Props) {
  const entries = useMemo<DriverEntry[]>(() => {
    const result: DriverEntry[] = []
    for (const project of data.results) {
      if (project.category !== 'Drivers') continue
      for (const release of project.releases) {
        if (!isWithinDays(release.date, 30)) continue
        const valid = getValidAssets(release.assets, project.extensions)
        if (valid.length === 0 && !release.assets.some(a => a.name.endsWith('.zip'))) continue
        result.push({ project, release })
      }
    }
    return result.sort((a, b) => new Date(b.release.date).getTime() - new Date(a.release.date).getTime())
  }, [data])

  return (
    <div className="tab-section">
      <div className="tab-section-header">
        <h2 className="tab-section-title">{t('newDrivers', 'title')}</h2>
        <p className="tab-section-subtitle text-muted">{t('newDrivers', 'subtitle')}</p>
      </div>

      {entries.length === 0 ? (
        <p className="empty-state">{t('newDrivers', 'noDrivers')}</p>
      ) : (
        <div className="driver-feed">
          {entries.map(({ project, release }) => {
            const isNew = isWithinDays(release.date, 7)
            return (
              <div
                key={`${project.repo}-${release.tag}`}
                className="driver-card glass-card"
                onClick={() => onProjectClick(project)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onProjectClick(project)}
                aria-label={`${project.name} ${release.tag}`}
              >
                <DriverLogo logo={project.logo} />
                <div className="driver-card-info">
                  <div className="driver-card-name">
                    {project.name}
                    {isNew && <span className="badge-new">{t('newDrivers', 'new')}</span>}
                  </div>
                  <div className="driver-card-meta">
                    <span className="release-tag">{release.tag}</span>
                    {release.name && release.name !== release.tag && (
                      <span className="text-muted">{release.name}</span>
                    )}
                  </div>
                  <div className="driver-card-stats">
                    <span className="text-muted">{timeAgo(release.date)}</span>
                    <span className="text-cyan">{formatNumber(release.downloads)} ↓</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
