import { useState, useEffect } from 'react'
import type { RankingsData } from '../types/rankings'

interface UseRankingsResult {
  data: RankingsData | null
  loading: boolean
  error: string | null
}

export function useRankings(): UseRankingsResult {
  const [data, setData] = useState<RankingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('./data/rankings.json')
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load rankings: HTTP ${r.status}`)
        return r.json()
      })
      .then((raw: unknown) => {
        let normalized: RankingsData
        // Handle both legacy array form and current object form
        if (Array.isArray(raw)) {
          normalized = {
            updatedAt: new Date().toISOString(),
            totalProjects: (raw as RankingsData['results']).length,
            projectsWithReleases: 0,
            projectsWithoutReleases: 0,
            results: raw as RankingsData['results'],
            manifestDrivers: {},
          }
        } else {
          normalized = raw as RankingsData
        }
        // Sort by downloads descending
        normalized.results = [...normalized.results].sort((a, b) => b.downloads - a.downloads)
        setData(normalized)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      })
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}
