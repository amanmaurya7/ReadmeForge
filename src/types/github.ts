export interface GitHubUser {
  login: string
  name?: string | null
  avatar_url: string
  html_url: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  language: string | null
  owner: {
    login: string
    avatar_url: string
  }
  stargazers_count: number
  forks_count: number
  watchers_count: number
  html_url: string
  default_branch: string
  license?: {
    key: string
    name: string
    spdx_id?: string
  } | null
  topics?: string[]
}

export interface GitHubContributor {
  id: number
  login: string
  html_url: string
  avatar_url: string
  contributions: number
}

export interface GitHubContentNode {
  name: string
  path: string
  type: 'dir' | 'file'
  download_url: string | null
}

export interface RepoProfile {
  installCommand: string
  runCommand: string
  detectedStack: string[]
  heuristics: string[]
}

export interface RepoAnalysis {
  repo: GitHubRepo
  contributors: GitHubContributor[]
  files: GitHubContentNode[]
  languages: string[]
  profile: RepoProfile
}

export interface TerminalLogEntry {
  id: string
  label: string
  status: 'pending' | 'done' | 'error'
  timestamp: number
}
