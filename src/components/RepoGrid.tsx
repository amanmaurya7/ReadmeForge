import { Github, LogOut, RefreshCcw, Search, Star, GitFork, Eye } from 'lucide-react'
import type { GitHubRepo, GitHubUser } from '../types/github'
import { formatNumber } from '../lib/format'

interface RepoGridProps {
  user: GitHubUser
  repos: GitHubRepo[]
  loading: boolean
  search: string
  onSearchChange: (value: string) => void
  onSelect: (repo: GitHubRepo) => void
  selectedRepoId?: number | null
  onRefresh: () => void
  onResetToken: () => void
}

export function RepoGrid({
  user,
  repos,
  loading,
  search,
  onSearchChange,
  onSelect,
  selectedRepoId,
  onRefresh,
  onResetToken,
}: RepoGridProps) {
  const filtered = repos.filter((repo) => repo.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <section className="mx-auto mt-10 w-full max-w-6xl text-white">
      <header className="glass-panel mb-6 flex flex-col gap-4 border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img src={user.avatar_url} alt={user.login} className="size-14 rounded-full border border-white/20" />
          <div>
            <p className="text-sm text-white/60">Authenticated as</p>
            <h2 className="font-display text-2xl">{user.name ?? user.login}</h2>
            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-brand-200"
            >
              <Github className="size-4" />
              {user.login}
            </a>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/40"
          >
            <RefreshCcw className="size-4" /> Refresh repos
          </button>
          <button
            onClick={onResetToken}
            className="inline-flex items-center gap-2 rounded-2xl border border-red-200/40 bg-red-500/10 px-4 py-2 text-sm text-red-100 transition hover:bg-red-500/20"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </header>

      <div className="glass-panel mb-6 flex flex-col gap-4 border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
          <Search className="size-4 text-white/50" />
          <input
            className="w-full bg-transparent text-white placeholder:text-white/30 focus:outline-none"
            placeholder="Search in your latest repositories"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <p className="text-sm text-white/50">
          Showing <strong>{filtered.length}</strong> of <strong>{repos.length}</strong> repositories
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {loading ? (
          <div className="col-span-full flex min-h-[200px] items-center justify-center text-white/60">Loading…</div>
        ) : filtered.length ? (
          filtered.map((repo) => (
            <article key={repo.id} className="glass-panel flex flex-col gap-4 border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl">{repo.name}</h3>
                  <p className="text-sm text-white/60">{repo.description ?? 'No description provided yet.'}</p>
                </div>
                <button
                  onClick={() => onSelect(repo)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    selectedRepoId === repo.id
                      ? 'bg-white text-slate-800'
                      : 'bg-brand-500 text-white hover:bg-brand-400'
                  }`}
                >
                  {selectedRepoId === repo.id ? 'Selected' : 'Generate README'}
                </button>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-white/60">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
                  <Star className="size-3" />
                  {formatNumber(repo.stargazers_count)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
                  <GitFork className="size-3" />
                  {formatNumber(repo.forks_count)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
                  <Eye className="size-3" />
                  {formatNumber(repo.watchers_count)}
                </span>
                {repo.license?.spdx_id ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
                    License: {repo.license.spdx_id}
                  </span>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <p className="col-span-full text-center text-white/60">No repositories matched your search.</p>
        )}
      </div>
    </section>
  )
}
