import { useMemo, useState } from 'react'
import type { RankingsData, ProjectResult } from '../types/rankings'
import type { TranslationKeys } from '../i18n/en'
import { isWithinDays } from '../utils/formatters'
import { getValidAssets } from '../utils/assetFilters'

interface Props {
  data: RankingsData
  onProjectClick: (p: ProjectResult) => void
  t: (section: keyof TranslationKeys, key: string) => string
}

interface ManifestDriverCard {
  name: string
  version: string | number
  url: string
  type: string
  isNew?: boolean
}

interface GithubDriverGroup {
  label: string
  projects: ProjectResult[]
}

function CopyBtn({ url, t }: { url: string; t: Props['t'] }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className="btn btn-copy"
      onClick={async () => {
        try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) }
        catch { /* ignore */ }
      }}
      aria-label={t('driversLibrary', 'copyLink')}
    >
      {copied ? '✓' : '⎘'}
    </button>
  )
}

export default function DriversLibraryTab({ data, onProjectClick, t }: Props) {
  const [typeFilter, setTypeFilter] = useState('')

  // Manifest drivers, categorized
  const manifestGroups = useMemo(() => {
    const groups: Record<string, ManifestDriverCard[]> = {}
    for (const [type, drivers] of Object.entries(data.manifestDrivers)) {
      groups[type] = drivers.map(d => ({
        name: String(d.name ?? ''),
        version: d.version ?? '',
        url: String(d.url ?? ''),
        type,
      }))
    }
    return groups
  }, [data.manifestDrivers])

  // GitHub driver projects, split into sub-categories
  const githubGroups = useMemo<GithubDriverGroup[]>(() => {
    const drivers = data.results.filter(p => p.category === 'Drivers')
    const turnip  = drivers.filter(p => p.name.toLowerCase().includes('turnip') || p.repo.toLowerCase().includes('turnip'))
    const adreno  = drivers.filter(p => p.name.toLowerCase().includes('adreno') && !p.name.toLowerCase().includes('turnip'))
    const other   = drivers.filter(p => !turnip.includes(p) && !adreno.includes(p))
    return [
      { label: 'Turnip Drivers', projects: turnip },
      { label: 'Adreno GPU Drivers', projects: adreno },
      { label: 'Other Drivers', projects: other },
    ].filter(g => g.projects.length > 0)
  }, [data.results])

  const allTypes = useMemo(() => Object.keys(manifestGroups), [manifestGroups])

  const filteredManifest = useMemo(() => {
    if (!typeFilter) return manifestGroups
    return Object.fromEntries(
      Object.entries(manifestGroups).filter(([type]) => type === typeFilter)
    )
  }, [manifestGroups, typeFilter])

  return (
    <div className="tab-section">
      <div className="tab-section-header">
        <h2 className="tab-section-title">{t('driversLibrary', 'title')}</h2>
        <p className="tab-section-subtitle text-muted">{t('driversLibrary', 'subtitle')}</p>
      </div>

      {/* GitHub driver projects */}
      <section className="drivers-section">
        <h3 className="drivers-section-title">GitHub Driver Repositories</h3>
        {githubGroups.map(group => (
          <div key={group.label} className="driver-group">
            <h4 className="driver-group-label">{group.label}</h4>
            <div className="driver-grid">
              {group.projects.map(project => {
                const hasNew = project.releases.some(r =>
                  isWithinDays(r.date, 7) && getValidAssets(r.assets, project.extensions).length > 0
                )
                const latestRelease = project.releases[0]
                return (
                  <div key={project.repo} className="driver-lib-card glass-card">
                    <div className="driver-lib-card-title">
                      {project.name}
                      {hasNew && <span className="badge-new">{t('driversLibrary', 'new')}</span>}
                    </div>
                    {latestRelease && (
                      <div className="driver-lib-version text-muted">{latestRelease.tag}</div>
                    )}
                    <div className="driver-lib-actions">
                      <button
                        className="btn btn-download"
                        onClick={() => onProjectClick(project)}
                        aria-label={`View releases for ${project.name}`}
                      >
                        {t('driversLibrary', 'viewReleases')}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Manifest drivers */}
      {allTypes.length > 0 && (
        <section className="drivers-section">
          <div className="drivers-section-header">
            <h3 className="drivers-section-title">Manifest Drivers</h3>
            {allTypes.length > 1 && (
              <select
                className="glass-select"
                style={{ maxWidth: 220 }}
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                aria-label={t('driversLibrary', 'allTypes')}
              >
                <option value="">{t('driversLibrary', 'allTypes')}</option>
                {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
          </div>

          {Object.entries(filteredManifest).map(([type, drivers]) => (
            <div key={type} className="driver-group">
              <h4 className="driver-group-label">{type}</h4>
              <div className="driver-grid">
                {drivers.map((d, i) => (
                  <div key={`${d.name}-${i}`} className="driver-lib-card glass-card">
                    <div className="driver-lib-card-title">{d.name || 'Unknown'}</div>
                    {d.version && <div className="driver-lib-version text-muted">v{d.version}</div>}
                    {d.url && (
                      <div className="driver-lib-actions">
                        <a
                          className="btn btn-download"
                          href={d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Download ${d.name}`}
                        >
                          {t('driversLibrary', 'download')} ↓
                        </a>
                        <CopyBtn url={d.url} t={t} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {allTypes.length === 0 && githubGroups.length === 0 && (
        <p className="empty-state">{t('driversLibrary', 'noDrivers')}</p>
      )}
    </div>
  )
}
