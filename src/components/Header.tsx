import { formatNumber, timeAgo } from '../utils/formatters'
import type { TranslationKeys } from '../i18n/en'

interface HeaderProps {
  totalDownloads: number
  totalProjects: number
  updatedAt: string | null
  newReleaseCount: number
  newDriverCount: number
  lang: string
  availableLangs: string[]
  onLangChange: (l: string) => void
  onTabChange: (tab: string) => void
  t: (section: keyof TranslationKeys, key: string) => string
}

export default function Header({
  totalDownloads,
  totalProjects,
  updatedAt,
  newReleaseCount,
  newDriverCount,
  lang,
  availableLangs,
  onLangChange,
  onTabChange,
  t,
}: HeaderProps) {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <div className="header-brand">
          <h1 className="text-arcade header-title">Arcade Aurora Glass</h1>
          <p className="header-subtitle">Emulator Download Rankings</p>
        </div>

        <div className="header-stats" aria-label="Site statistics">
          <div className="stat-pill">
            <span className="stat-value">{formatNumber(totalDownloads)}</span>
            <span className="stat-label">{t('header', 'totalDownloads')}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-value">{totalProjects}</span>
            <span className="stat-label">{t('header', 'totalProjects')}</span>
          </div>
          {updatedAt && (
            <div className="stat-pill">
              <span className="stat-value">{timeAgo(updatedAt)}</span>
              <span className="stat-label">{t('header', 'lastSync')}</span>
            </div>
          )}
        </div>

        <div className="header-actions">
          {newReleaseCount > 0 && (
            <button
              className="badge-new header-badge"
              onClick={() => onTabChange('recent')}
              aria-label={`${newReleaseCount} ${t('header', 'newReleases')}`}
            >
              {newReleaseCount} {t('header', 'newReleases')}
            </button>
          )}
          {newDriverCount > 0 && (
            <button
              className="badge-new badge-hot header-badge"
              onClick={() => onTabChange('newDrivers')}
              aria-label={`${newDriverCount} ${t('header', 'newDrivers')}`}
            >
              {newDriverCount} {t('header', 'newDrivers')}
            </button>
          )}
          <div className="lang-toggle" role="group" aria-label="Language selector">
            {availableLangs.map(l => (
              <button
                key={l}
                className={`lang-btn ${lang === l ? 'lang-btn-active' : ''}`}
                onClick={() => onLangChange(l)}
                aria-pressed={lang === l}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
