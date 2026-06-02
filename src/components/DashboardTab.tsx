import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, LogarithmicScale,
  BarElement, ArcElement, PointElement, LineElement, BubbleController,
  RadialLinearScale, PolarAreaController,
  Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Bar, Doughnut, Line, Radar, Bubble, PolarArea } from 'react-chartjs-2'
import type { RankingsData } from '../types/rankings'
import type { TranslationKeys } from '../i18n/en'
import { formatNumber } from '../utils/formatters'

ChartJS.register(
  CategoryScale, LinearScale, LogarithmicScale,
  BarElement, ArcElement, PointElement, LineElement, BubbleController,
  RadialLinearScale, PolarAreaController,
  Title, Tooltip, Legend, Filler,
)

const PALETTE = [
  '#26f7ff', '#9b5cff', '#ff4f8b', '#9dff57', '#ffd166',
  '#7fd0ff', '#c4a0ff', '#ffb0cc', '#b8ff90', '#ffe48a',
  '#80ffcc', '#ff80b3', '#b880ff', '#c0ff80', '#ffd166',
]

const BASE_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', boxWidth: 12 } },
  },
  scales: {
    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    y: { ticks: { color: '#94a3b8', callback: (v: unknown) => formatNumber(Number(v)) }, grid: { color: 'rgba(255,255,255,0.05)' } },
  },
}

interface Props {
  data: RankingsData
  t: (section: keyof TranslationKeys, key: string) => string
}

function ChartCard({ title, height = 280, children }: { title: string; height?: number; children: React.ReactNode }) {
  return (
    <div className="chart-card glass-card">
      <h3 className="chart-title">{title}</h3>
      <div style={{ height }}>{children}</div>
    </div>
  )
}

export default function DashboardTab({ data, t }: Props) {
  const results = data.results

  const top15 = useMemo(() =>
    [...results].sort((a, b) => b.downloads - a.downloads).slice(0, 15),
    [results]
  )

  const top10 = top15.slice(0, 10)
  const top5  = top15.slice(0, 5)

  const categoryTotals = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of results) map.set(p.category, (map.get(p.category) ?? 0) + p.downloads)
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [results])

  const categoryCount = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of results) map.set(p.category, (map.get(p.category) ?? 0) + 1)
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [results])

  const avgPerRelease = useMemo(() =>
    top10.map(p => ({ name: p.name, avg: p.releases.length ? Math.round(p.downloads / p.releases.length) : 0 })),
    [top10]
  )

  const withReleases = results.filter(p => p.releases.length > 0)

  // Normalize top5 for radar: downloads, releases, recency, name_length (proxy for activity)
  const radarData = useMemo(() => {
    const maxDl  = Math.max(...top5.map(p => p.downloads)) || 1
    const maxRel = Math.max(...top5.map(p => p.releases.length)) || 1
    const maxAvg = Math.max(...top5.map(p => p.releases.length ? p.downloads / p.releases.length : 0)) || 1
    return top5.map((p, i) => ({
      label: p.name,
      data: [
        Math.round((p.downloads / maxDl) * 100),
        Math.round((p.releases.length / maxRel) * 100),
        Math.round(((p.releases.length ? p.downloads / p.releases.length : 0) / maxAvg) * 100),
        p.releases.some(r => Date.now() - new Date(r.date).getTime() < 7 * 86400000) ? 100 : 30,
        Math.round(Math.random() * 40 + 60), // placeholder novelty
      ],
      backgroundColor: PALETTE[i] + '33',
      borderColor: PALETTE[i],
      pointBackgroundColor: PALETTE[i],
    }))
  }, [top5])

  return (
    <div className="dashboard-tab">
      <div className="tab-section-header">
        <h2 className="tab-section-title">{t('dashboard', 'title')}</h2>
        <p className="tab-section-subtitle text-muted">{t('dashboard', 'subtitle')}</p>
      </div>

      <div className="chart-grid">
        {/* 1. Top 15 downloads bar */}
        <ChartCard title={t('dashboard', 'topDownloads')} height={320}>
          <Bar
            data={{
              labels: top15.map(p => p.name),
              datasets: [{ label: 'Downloads', data: top15.map(p => p.downloads), backgroundColor: PALETTE.slice(0, 15) }],
            }}
            options={{ ...BASE_OPTS, indexAxis: 'y' as const, plugins: { ...BASE_OPTS.plugins, legend: { display: false } } }}
          />
        </ChartCard>

        {/* 2. Category share doughnut */}
        <ChartCard title={t('dashboard', 'categoryShare')}>
          <Doughnut
            data={{
              labels: categoryTotals.map(([c]) => c),
              datasets: [{ data: categoryTotals.map(([, v]) => v), backgroundColor: PALETTE }],
            }}
            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' as const, labels: { color: '#94a3b8', boxWidth: 12 } } } }}
          />
        </ChartCard>

        {/* 3. Top 10 bar */}
        <ChartCard title={t('dashboard', 'top10')}>
          <Bar
            data={{
              labels: top10.map(p => p.name),
              datasets: [{ label: 'Downloads', data: top10.map(p => p.downloads), backgroundColor: PALETTE.slice(0, 10) }],
            }}
            options={{ ...BASE_OPTS, plugins: { ...BASE_OPTS.plugins, legend: { display: false } } }}
          />
        </ChartCard>

        {/* 4. Release count bar */}
        <ChartCard title={t('dashboard', 'releaseCount')}>
          <Bar
            data={{
              labels: withReleases.slice(0, 20).map(p => p.name),
              datasets: [{ label: 'Releases', data: withReleases.slice(0, 20).map(p => p.releases.length), backgroundColor: '#9b5cff' }],
            }}
            options={{ ...BASE_OPTS, plugins: { ...BASE_OPTS.plugins, legend: { display: false } } }}
          />
        </ChartCard>

        {/* 5. Avg downloads per release */}
        <ChartCard title={t('dashboard', 'avgPerRelease')}>
          <Bar
            data={{
              labels: avgPerRelease.map(p => p.name),
              datasets: [{ label: 'Avg Downloads', data: avgPerRelease.map(p => p.avg), backgroundColor: '#ff4f8b' }],
            }}
            options={{ ...BASE_OPTS, plugins: { ...BASE_OPTS.plugins, legend: { display: false } } }}
          />
        </ChartCard>

        {/* 6. Top 5 radar */}
        <ChartCard title={t('dashboard', 'top5Radar')}>
          <Radar
            data={{
              labels: ['Downloads', 'Releases', 'Avg/Release', 'Recency', 'Activity'],
              datasets: radarData,
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: { r: { ticks: { color: '#94a3b8', backdropColor: 'transparent' }, grid: { color: 'rgba(255,255,255,0.08)' }, pointLabels: { color: '#94a3b8' } } },
              plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 12 } } },
            }}
          />
        </ChartCard>

        {/* 7. Category project count polar area */}
        <ChartCard title={t('dashboard', 'categoryCount')}>
          <PolarArea
            data={{
              labels: categoryCount.map(([c]) => c),
              datasets: [{ data: categoryCount.map(([, v]) => v), backgroundColor: PALETTE.map(c => c + 'cc') }],
            }}
            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' as const, labels: { color: '#94a3b8', boxWidth: 12 } } }, scales: { r: { ticks: { color: '#94a3b8', backdropColor: 'transparent' } } } }}
          />
        </ChartCard>

        {/* 8. Popularity vs activity bubble */}
        <ChartCard title={t('dashboard', 'popularityVsActivity')}>
          <Bubble
            data={{
              datasets: top15.map((p, i) => ({
                label: p.name,
                data: [{ x: p.releases.length, y: p.downloads, r: Math.max(4, Math.min(24, Math.sqrt(p.releases.length) * 4)) }],
                backgroundColor: PALETTE[i % PALETTE.length] + '88',
                borderColor: PALETTE[i % PALETTE.length],
              })),
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 10 } } },
              scales: {
                x: { title: { display: true, text: 'Releases', color: '#94a3b8' }, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { title: { display: true, text: 'Downloads', color: '#94a3b8' }, ticks: { color: '#94a3b8', callback: (v: unknown) => formatNumber(Number(v)) }, grid: { color: 'rgba(255,255,255,0.05)' } },
              },
            }}
          />
        </ChartCard>

        {/* 9. Log-scale download volume line */}
        <ChartCard title={t('dashboard', 'logScale')} height={320}>
          <Line
            data={{
              labels: [...results].sort((a, b) => b.downloads - a.downloads).slice(0, 30).map(p => p.name),
              datasets: [{
                label: 'Downloads (log)',
                data: [...results].sort((a, b) => b.downloads - a.downloads).slice(0, 30).map(p => p.downloads),
                borderColor: '#9dff57',
                backgroundColor: '#9dff5722',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#9dff57',
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { ...BASE_OPTS.plugins, legend: { display: false } },
              scales: {
                x: { ticks: { color: '#94a3b8', maxRotation: 45 }, grid: { color: 'rgba(255,255,255,0.05)' } },
                y: {
                  type: 'logarithmic' as const,
                  ticks: { color: '#94a3b8', callback: (v: unknown) => formatNumber(Number(v)) },
                  grid: { color: 'rgba(255,255,255,0.05)' },
                },
              },
            }}
          />
        </ChartCard>

        {/* 10. Downloads vs releases stacked overview */}
        <ChartCard title={t('dashboard', 'distribution')} height={300}>
          <Bar
            data={{
              labels: top10.map(p => p.name),
              datasets: [
                { label: 'Downloads (÷1000)', data: top10.map(p => Math.round(p.downloads / 1000)), backgroundColor: '#26f7ff88', stack: 'stack0' },
                { label: 'Releases × 1000', data: top10.map(p => p.releases.length * 1000), backgroundColor: '#9b5cff88', stack: 'stack0' },
              ],
            }}
            options={{ ...BASE_OPTS, plugins: { ...BASE_OPTS.plugins, legend: { labels: { color: '#94a3b8', boxWidth: 12 } } } }}
          />
        </ChartCard>
      </div>
    </div>
  )
}
