import { useState, useMemo } from 'react'
import type { RankingsData, ProjectResult } from '../types/rankings'
import type { TranslationKeys } from '../i18n/en'
import { formatNumber, isWithinDays } from '../utils/formatters'
import { getCategoryPillClass, getValidAssets, getLatestValidAsset } from '../utils/assetFilters'
import DataQualityPanel from './DataQualityPanel'

type SortKey = 'downloads_desc' | 'downloads_asc' | 'name_az' | 'name_za'

interface Props {
  data: RankingsData
  onProjectClick: (p: ProjectResult) => void
  t: (section: keyof TranslationKeys, key: string) => string
}

function ProjectLogo({ logo, name }: { logo?: string; name: string }) {
  const [failed, setFailed] = useState(false)
  if (logo && !failed) {
    return (
      <img
        src={`./logos/${logo}`}
        alt=""
        className="project-logo"
        onError={() => setFailed(true)}
        loading="lazy"
      />
    )
  }
  return (
    <div className="project-logo-fallback" aria-hidden="true">
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

function RankOrb({ rank }: { rank: number }) {
  if (rank <= 3) {
    return <span className="rank-orb" data-rank={String(rank)}>{rank}</span>
  }
  return <span className="rank-orb" data-rank="n">{rank}</span>
}

export default function RankingTab({ data, onProjectClick, t }: Props) {
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '')
  const [category, setCategory] = useState(() => new URLSearchParams(window.location.search).get('cat') ?? '')
  const [sort, setSort] = useState<SortKey>('downloads_desc')

  const nonDriverResults = useMemo(
    () => data.results.filter(p => p.category !== 'Drivers'),
    [data.results]
  )

  const categories = useMemo(() => {
    const cats = [...new Set(nonDriverResults.map(p => p.category))].sort()
    return cats
  }, [nonDriverResults])

  const filtered = useMemo(() => {
    let list = nonDriverResults
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
    }
    if (category) {
      list = list.filter(p => p.category === category)
    }
    switch (sort) {
      case 'downloads_asc': return [...list].sort((a, b) => a.downloads - b.downloads)
      case 'name_az':       return [...list].sort((a, b) => a.name.localeCompare(b.name))
      case 'name_za':       return [...list].sort((a, b) => b.name.localeCompare(a.name))
      default:              return [...list].sort((a, b) => b.downloads - a.downloads)
    }
  }, [nonDriverResults, search, category, sort])

  // Rank is position in the downloads-sorted list (always relative to full list, not filtered)
  const rankMap = useMemo(() => {
    const sorted = [...nonDriverResults].sort((a, b) => b.downloads - a.downloads)
    return new Map(sorted.map((p, i) => [p.repo, i + 1]))
  }, [nonDriverResults])

  const handleSearchChange = (v: string) => {
    setSearch(v)
    const u = new URL(window.location.href)
    v ? u.searchParams.set('q', v) : u.searchParams.delete('q')
    history.replaceState(null, '', u)
  }

  const handleCategoryChange = (v: string) => {
    setCategory(v)
    const u = new URL(window.location.href)
    v ? u.searchParams.set('cat', v) : u.searchParams.delete('cat')
    history.replaceState(null, '', u)
  }

  return (
    <div className="ranking-tab">
      <DataQualityPanel data={data} t={t} />

      <div className="ranking-controls glass-card">
        <div className="ranking-search">
          <label htmlFor="ranking-search" className="sr-only">{t('ranking', 'search')}</label>
          <input
            id="ranking-search"
            type="search"
            className="glass-input"
            placeholder={t('ranking', 'search')}
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            aria-label={t('ranking', 'search')}
          />
        </div>
        <div className="ranking-filters">
          <label htmlFor="cat-filter" className="sr-only">{t('ranking', 'allCategories')}</label>
          <select
            id="cat-filter"
            className="glass-select"
            value={category}
            onChange={e => handleCategoryChange(e.target.value)}
            aria-label={t('ranking', 'allCategories')}
          >
            <option value="">{t('ranking', 'allCategories')}</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <label htmlFor="sort-select" className="sr-only">Sort</label>
          <select
            id="sort-select"
            className="glass-select"
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
          >
            <option value="downloads_desc">{t('ranking', 'sortDownloadsDesc')}</option>
            <option value="downloads_asc">{t('ranking', 'sortDownloadsAsc')}</option>
            <option value="name_az">{t('ranking', 'sortNameAz')}</option>
            <option value="name_za">{t('ranking', 'sortNameZa')}</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">{t('ranking', 'noResults')}</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="ranking-table-wrap glass-card">
            <table className="ranking-table" aria-label="Project rankings">
              <thead>
                <tr>
                  <th>{t('ranking', 'colRank')}</th>
                  <th>{t('ranking', 'colProject')}</th>
                  <th>{t('ranking', 'colCategory')}</th>
                  <th className="col-num">{t('ranking', 'colDownloads')}</th>
                  <th className="col-num">{t('ranking', 'colReleases')}</th>
                  <th>{t('ranking', 'colLastRelease')}</th>
                  <th className="sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(project => {
                  const rank = rankMap.get(project.repo) ?? 0
                  const latest = project.releases[0]
                  const isNew = latest && isWithinDays(latest.date, 7) && getValidAssets(latest.assets, project.extensions).length > 0
                  const latestAsset = latest ? getLatestValidAsset(latest.assets, project.extensions) : null

                  return (
                    <tr
                      key={project.repo}
                      className="ranking-row"
                      onClick={() => onProjectClick(project)}
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && onProjectClick(project)}
                      aria-label={`${project.name}, ${formatNumber(project.downloads)} downloads`}
                      role="button"
                    >
                      <td className="col-rank"><RankOrb rank={rank} /></td>
                      <td className="col-project">
                        <div className="project-name-cell">
                          <ProjectLogo logo={project.logo} name={project.name} />
                          <div className="project-name-info">
                            <span className="project-name">{project.name}</span>
                            {isNew && <span className="badge-new">{t('ranking', 'new')}</span>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`category-pill ${getCategoryPillClass(project.category)}`}>
                          {project.category}
                        </span>
                      </td>
                      <td className="col-num">{formatNumber(project.downloads)}</td>
                      <td className="col-num">{project.releases.length}</td>
                      <td className="col-date text-muted">
                        {latest ? new Date(latest.date).toLocaleDateString() : '—'}
                      </td>
                      <td className="col-action" onClick={e => e.stopPropagation()}>
                        {latestAsset && (
                          <a
                            className="btn btn-download"
                            href={latestAsset.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Download ${project.name}`}
                            title={t('ranking', 'quickDownload')}
                            onClick={e => e.stopPropagation()}
                          >
                            ↓
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="ranking-cards">
            {filtered.map(project => {
              const rank = rankMap.get(project.repo) ?? 0
              const latest = project.releases[0]
              const isNew = latest && isWithinDays(latest.date, 7) && getValidAssets(latest.assets, project.extensions).length > 0

              return (
                <div
                  key={project.repo}
                  className="rank-card glass-card"
                  onClick={() => onProjectClick(project)}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && onProjectClick(project)}
                  role="button"
                  aria-label={`${project.name}, ${formatNumber(project.downloads)} downloads`}
                >
                  <div className="rank-card-rank"><RankOrb rank={rank} /></div>
                  <div className="rank-card-logo"><ProjectLogo logo={project.logo} name={project.name} /></div>
                  <div className="rank-card-info">
                    <div className="rank-card-name">
                      {project.name}
                      {isNew && <span className="badge-new">{t('ranking', 'new')}</span>}
                    </div>
                    <span className={`category-pill ${getCategoryPillClass(project.category)}`}>
                      {project.category}
                    </span>
                  </div>
                  <div className="rank-card-downloads">
                    <span className="text-cyan">{formatNumber(project.downloads)}</span>
                    <span className="text-muted" style={{ fontSize: 11 }}>↓</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
