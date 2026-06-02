import projectsData from '../../config/projects.json'

export interface ProjectConfig {
  name: string
  repo: string
  category: string
  logo?: string
  extensions?: string[]
  apiType?: 'github' | 'gitea' | 'forgejo'
  apiHost?: string
  upstream?: string
  skipFetch?: boolean
}

export const PROJECTS = (projectsData as { projects: ProjectConfig[] }).projects
