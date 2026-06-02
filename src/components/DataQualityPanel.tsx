import { useState } from 'react'
import type { RankingsData } from '../types/rankings'
import type { TranslationKeys } from '../i18n/en'
import { formatDate } from '../utils/formatters'

interface Props {
  data: RankingsData
  t: (section: keyof TranslationKeys, key: string) => string
}

export default function DataQualityPanel({ data, t }: Props) {
  const [open, setOpen] = useState(false)
  const failed   = data.results.filter(r => r.fetchError)
  const noRelease = data.results.filter(r => r.releases.length === 0 && !r.fetchError)

  if (failed.length === 0 && noRelease.length === 0) return null

  return (
    <div className="dq-panel glass-card">
      <button className="dq-toggle" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>⚠ {t('dataQuality', 'title')}</span>
        <span className="dq-counts">
          {failed.length > 0 && <span className="dq-chip dq-chip-error">{failed.length} {t('dataQuality', 'failedRepos')}</span>}
          {noRelease.length > 0 && <span className="dq-chip dq-chip-warn">{noRelease.length} {t('dataQuality', 'noReleaseRepos')}</span>}
        </span>
        <span className="dq-arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="dq-body">
          <p className="dq-sync text-muted">
            {t('dataQuality', 'lastFetch')}: {formatDate(data.updatedAt)}
          </p>
          {failed.length > 0 && (
            <div>
              <p className="dq-section-title text-coral">{t('dataQuality', 'failedRepos')}</p>
              <ul className="dq-list">
                {failed.map(r => (
                  <li key={r.repo} className="dq-item">
                    <code className="dq-repo">{r.repo}</code>
                    {r.fetchError && <span className="dq-error-msg text-muted"> — {r.fetchError}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {noRelease.length > 0 && (
            <div>
              <p className="dq-section-title text-amber">{t('dataQuality', 'noReleaseRepos')}</p>
              <ul className="dq-list">
                {noRelease.map(r => (
                  <li key={r.repo} className="dq-item">
                    <code className="dq-repo">{r.repo}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
