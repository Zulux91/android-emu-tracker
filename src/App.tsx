import { Suspense, lazy, useState, useCallback, useMemo } from 'react'
import { useRankings } from './hooks/useRankings'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useI18n } from './hooks/useI18n'
import { isWithinDays } from './utils/formatters'
import { hasValidAsset } from './utils/assetFilters'
import Header from './components/Header'
import TabNav from './components/TabNav'
import type { ProjectResult } from './types/rankings'

const RankingTab      = lazy(() => import('./components/RankingTab'))
const DashboardTab    = lazy(() => import('./components/DashboardTab'))
const DriversTab      = lazy(() => import('./components/DriversLibraryTab'))
const NewDriversTab   = lazy(() => import('./components/NewDriversTab'))
const RecentTab       = lazy(() => import('./components/RecentReleasesTab'))

function getInitialTab(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('tab') ?? 'ranking'
}

function LoadingFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 20px' }}>
      <div className="spinner" aria-label="Loading…" />
    </div>
  )
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="error-screen glass-card">
      <span className="error-icon" aria-hidden="true">⚠️</span>
      <p>{message}</p>
      <button className="btn" onClick={() => window.location.reload()}>Reload</button>
    </div>
  )
}

export default function App() {
  const { data, loading, error } = useRankings()
  const { lang, setLang, t, availableLangs } = useI18n()

  const [activeTab, setActiveTabRaw] = useLocalStorage('tab', getInitialTab())
  const [selectedProject, setSelectedProject] = useState<ProjectResult | null>(null)

  const setActiveTab = useCallback((tab: string) => {
    setActiveTabRaw(tab)
    const u = new URL(window.location.href)
    u.searchParams.set('tab', tab)
    history.replaceState(null, '', u)
  }, [setActiveTabRaw])

  // Computed stats for header badges
  const { totalDownloads, newReleaseCount, newDriverCount } = useMemo(() => {
    if (!data) return { totalDownloads: 0, newReleaseCount: 0, newDriverCount: 0 }
    let total = 0
    let releases = 0
    let drivers = 0
    for (const p of data.results) {
      total += p.downloads
      const hasNew = p.releases.some(r => isWithinDays(r.date, 7) && hasValidAsset(r.assets, p.extensions))
      if (hasNew) {
        if (p.category === 'Drivers') drivers++
        else releases++
      }
    }
    return { totalDownloads: total, newReleaseCount: releases, newDriverCount: drivers }
  }, [data])

  // Lazily import ProjectModal only when needed
  const ProjectModal = useMemo(() => lazy(() => import('./components/ProjectModal')), [])

  return (
    <>
      {/* Aurora background */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
        <div className="aurora-blob aurora-blob-4" />
      </div>

      {/* App shell */}
      <div className="app-shell">
        <Header
          totalDownloads={totalDownloads}
          totalProjects={data?.totalProjects ?? 0}
          nextUpdateAt={data?.nextUpdateAt ?? (data?.updatedAt ? new Date(new Date(data.updatedAt).getTime() + 3_600_000).toISOString() : null)}
          newReleaseCount={newReleaseCount}
          newDriverCount={newDriverCount}
          lang={lang}
          availableLangs={availableLangs}
          onLangChange={setLang}
          onTabChange={setActiveTab}
          t={t}
        />

        <TabNav activeTab={activeTab} onTabChange={setActiveTab} t={t} />

        <main className="main-content" id={`panel-${activeTab}`} role="tabpanel">
          {loading && <LoadingFallback />}
          {!loading && error && <ErrorScreen message={t('errors', 'loadFailed')} />}
          {!loading && !error && data && (
            <Suspense fallback={<LoadingFallback />}>
              {activeTab === 'ranking' && (
                <RankingTab data={data} onProjectClick={setSelectedProject} t={t} />
              )}
              {activeTab === 'dashboard' && (
                <DashboardTab data={data} t={t} />
              )}
              {activeTab === 'drivers' && (
                <DriversTab data={data} onProjectClick={setSelectedProject} t={t} />
              )}
              {activeTab === 'newDrivers' && (
                <NewDriversTab data={data} onProjectClick={setSelectedProject} t={t} />
              )}
              {activeTab === 'recent' && (
                <RecentTab data={data} onProjectClick={setSelectedProject} t={t} />
              )}
            </Suspense>
          )}
        </main>
      </div>

      {/* Project detail modal */}
      {selectedProject && (
        <Suspense fallback={null}>
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} t={t} />
        </Suspense>
      )}
    </>
  )
}
