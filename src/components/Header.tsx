import { useState, useEffect } from 'react'
import { formatNumber } from '../utils/formatters'
import type { TranslationKeys } from '../i18n/en'

interface HeaderProps {
  totalDownloads: number
  totalProjects: number
  nextUpdateAt: string | null
  newReleaseCount: number
  newDriverCount: number
  lang: string
  availableLangs: string[]
  onLangChange: (l: string) => void
  onTabChange: (tab: string) => void
  t: (section: keyof TranslationKeys, key: string) => string
}

function useCountdown(target: string | null): string {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    if (!target) return
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now()
      if (diff <= 0) { setDisplay('any moment…'); return }
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      setDisplay(h > 0
        ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        : `${m}:${String(s).padStart(2, '0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  return display
}

export default function Header({
  totalDownloads,
  totalProjects,
  nextUpdateAt,
  newReleaseCount,
  newDriverCount,
  lang,
  availableLangs,
  onLangChange,
  onTabChange,
  t,
}: HeaderProps) {
  const countdown = useCountdown(nextUpdateAt)
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
          {countdown && (
            <div className="stat-pill">
              <span className="stat-value">{countdown}</span>
              <span className="stat-label">{t('header', 'nextSync')}</span>
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
