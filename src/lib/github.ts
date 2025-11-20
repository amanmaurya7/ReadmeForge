import type {
  GitHubContentNode,
  GitHubContributor,
  GitHubRepo,
  GitHubUser,
} from '../types/github'

const API_BASE = 'https://api.github.com'

async function githubRequest<T>(endpoint: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
    },
    ...init,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `GitHub request failed with ${response.status}`)
  }

  return response.json() as Promise<T>
}

export const GitHubAPI = {
  verifyToken(token: string) {
    return githubRequest<GitHubUser>('/user', token)
  },
  fetchRepos(token: string) {
    return githubRequest<GitHubRepo[]>('/user/repos?sort=updated&per_page=100', token)
  },
  fetchRepo(token: string, fullName: string) {
    return githubRequest<GitHubRepo>(`/repos/${fullName}`, token)
  },
  fetchContributors(token: string, fullName: string) {
    return githubRequest<GitHubContributor[]>(`/repos/${fullName}/contributors?per_page=30`, token)
  },
  fetchLanguages(token: string, fullName: string) {
    return githubRequest<Record<string, number>>(`/repos/${fullName}/languages`, token)
  },
  fetchRootContents(token: string, fullName: string, ref: string) {
    return githubRequest<GitHubContentNode[]>(`/repos/${fullName}/contents?ref=${ref}`, token)
  },
}
