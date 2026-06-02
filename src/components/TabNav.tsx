import type { TranslationKeys } from '../i18n/en'

const TABS: { id: string; icon: string; labelKey: keyof TranslationKeys['tabs'] }[] = [
  { id: 'ranking',    icon: '🏆', labelKey: 'ranking' },
  { id: 'dashboard',  icon: '📊', labelKey: 'dashboard' },
  { id: 'drivers',    icon: '🎮', labelKey: 'driversLibrary' },
  { id: 'newDrivers', icon: '✨', labelKey: 'newDrivers' },
  { id: 'recent',     icon: '🕐', labelKey: 'recentReleases' },
]

interface TabNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  t: (section: keyof TranslationKeys, key: string) => string
}

export default function TabNav({ activeTab, onTabChange, t }: TabNavProps) {
  return (
    <nav className="tab-nav" role="tablist" aria-label="Main navigation">
      {TABS.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
          <span className="tab-label">{t('tabs', tab.labelKey)}</span>
        </button>
      ))}
    </nav>
  )
}
