import { useState, useCallback } from 'react'
import { TokenGate } from './components/TokenGate'
import { RepoGrid } from './components/RepoGrid'
import { TerminalLog } from './components/TerminalLog'
import { MarkdownEditor } from './components/MarkdownEditor'
import { GitHubAPI } from './lib/github'
import { inferProfile } from './lib/heuristics'
import { generateReadme } from './lib/template'
import type {
  GitHubUser,
  GitHubRepo,
  TerminalLogEntry,
  RepoAnalysis,
} from './types/github'
import { FileText } from 'lucide-react'

type Phase = 'auth' | 'repos' | 'analysis' | 'editor'

function App() {
  const [phase, setPhase] = useState<Phase>('auth')
  const [token, setToken] = useState('')
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null)
  const [logs, setLogs] = useState<TerminalLogEntry[]>([])
  const [markdown, setMarkdown] = useState('')

  const addLog = useCallback((label: string, status: TerminalLogEntry['status'] = 'pending') => {
    const entry: TerminalLogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      label,
      status,
      timestamp: Date.now(),
    }
    setLogs((prev) => [...prev, entry])
    return entry.id
  }, [])

  const updateLog = useCallback((id: string, status: TerminalLogEntry['status']) => {
    setLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, status } : log))
    )
  }, [])

  const handleTokenSubmit = async (providedToken: string) => {
    setLoading(true)
    setError(null)
    try {
      const userData = await GitHubAPI.verifyToken(providedToken)
      setToken(providedToken)
      setUser(userData)
      setPhase('repos')

      const repoData = await GitHubAPI.fetchRepos(providedToken)
      setRepos(repoData)
    } catch (err) {
      setError((err as Error).message || 'Failed to validate the GitHub token. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRepoSelect = async (repo: GitHubRepo) => {
    if (!user) return
    setSelectedRepoId(repo.id)
    setPhase('analysis')
    setLogs([])

    try {
      const logRepoFetch = addLog('Fetching detailed repository information…', 'pending')
      const detailedRepo = await GitHubAPI.fetchRepo(token, repo.full_name)
      updateLog(logRepoFetch, 'done')

      const logContributors = addLog('Listing contributors…', 'pending')
      const contributors = await GitHubAPI.fetchContributors(token, repo.full_name)
      updateLog(logContributors, 'done')

      const logLanguages = addLog('Analyzing programming language distribution…', 'pending')
      const languageMap = await GitHubAPI.fetchLanguages(token, repo.full_name)
      const languages = Object.keys(languageMap)
      updateLog(logLanguages, 'done')

      const logFiles = addLog('Scanning root directory for heuristic signatures…', 'pending')
      const files = await GitHubAPI.fetchRootContents(token, repo.full_name, repo.default_branch)
      updateLog(logFiles, 'done')

      const logProfile = addLog('Running rule-based heuristic inference…', 'pending')
      const profile = inferProfile(files)
      updateLog(logProfile, 'done')

      const analysis: RepoAnalysis = {
        repo: detailedRepo,
        contributors,
        languages,
        files,
        profile,
      }

      const logGenerate = addLog('Generating README.md template from analysis results…', 'pending')
      const markdown = generateReadme(analysis, user)
      setMarkdown(markdown)
      updateLog(logGenerate, 'done')

      addLog('✓ Analysis complete. Ready for editing.', 'done')
      setTimeout(() => setPhase('editor'), 1200)
    } catch (err) {
      const errorLog = addLog((err as Error).message || 'Failed to analyze repository.', 'error')
      updateLog(errorLog, 'error')
    }
  }

  const handleRepoRefresh = async () => {
    if (!token) return
    setLoading(true)
    try {
      const repoData = await GitHubAPI.fetchRepos(token)
      setRepos(repoData)
    } finally {
      setLoading(false)
    }
  }

  const handleResetToken = () => {
    setToken('')
    setUser(null)
    setRepos([])
    setSearch('')
    setSelectedRepoId(null)
    setLogs([])
    setMarkdown('')
    setPhase('auth')
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <header className="mx-auto mb-8 max-w-6xl text-center">
        <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white">
          <FileText className="size-5 text-brand-200" />
          <h1 className="font-display text-2xl">ReadmeForge</h1>
        </div>
        <p className="text-white/70">
          Automate your README generation with intelligent heuristic analysis
        </p>
      </header>

      {phase === 'auth' && (
        <TokenGate
          onSubmit={handleTokenSubmit}
          initialToken={token}
          loading={loading}
          error={error}
        />
      )}

      {phase === 'repos' && user && (
        <RepoGrid
          user={user}
          repos={repos}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          onSelect={handleRepoSelect}
          selectedRepoId={selectedRepoId}
          onRefresh={handleRepoRefresh}
          onResetToken={handleResetToken}
        />
      )}

      {phase === 'analysis' && (
        <section className="mx-auto mt-10 w-full max-w-4xl">
          <TerminalLog logs={logs} />
        </section>
      )}

      {phase === 'editor' && (
        <section className="mx-auto mt-10 w-full max-w-6xl">
          <h2 className="mb-4 font-display text-3xl text-white">
            Edit your generated README
          </h2>
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
        </section>
      )}
    </div>
  )
}

export default App
