export interface ReleaseAsset {
  name: string
  size: number
  downloads: number
  url: string
}

export interface Release {
  name: string
  tag: string
  date: string
  downloads: number
  body: string
  prerelease: boolean
  htmlUrl: string
  assets: ReleaseAsset[]
}

export interface ProjectResult {
  name: string
  repo: string
  category: string
  logo?: string
  downloads: number
  releases: Release[]
  repoUrl: string
  extensions?: string[]
  upstream?: string
  fetchError?: string
}

export interface ManifestDriver {
  name: string
  version: string | number
  url: string
  date?: string
  [key: string]: unknown
}

export interface RankingsData {
  updatedAt: string
  totalProjects: number
  projectsWithReleases: number
  projectsWithoutReleases: number
  results: ProjectResult[]
  manifestDrivers: Record<string, ManifestDriver[]>
}
