import { useState } from 'react'
import { Github, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react'

interface TokenGateProps {
  onSubmit: (token: string) => Promise<void> | void
  initialToken?: string
  loading: boolean
  error?: string | null
}

const TOKEN_DOCS_URL =
  'https://github.com/settings/personal-access-tokens/new?scopes=repo,user&description=ReadmeForge'

export function TokenGate({ onSubmit, initialToken = '', loading, error }: TokenGateProps) {
  const [token, setToken] = useState(initialToken)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token.trim()) return
    await onSubmit(token.trim())
  }

  return (
    <section className="glass-panel mx-auto mt-16 w-full max-w-3xl px-10 py-12 text-white">
      <div className="mb-8 flex items-center gap-3 text-brand-200">
        <ShieldCheck className="size-6" />
        <p className="text-sm uppercase tracking-[0.3em]">Step 1 · Authenticate</p>
      </div>
      <h1 className="mb-3 font-display text-4xl text-white">Paste your GitHub token</h1>
      <p className="mb-8 text-lg text-white/70">
        ReadmeForge connects directly to GitHub&apos;s REST API using a short-lived Personal Access Token (PAT).
        Your key never leaves the browser. Generate a classic token with the <code>repo</code> and <code>user</code>
        scopes, then paste it below.
      </p>

      <a
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
        href={TOKEN_DOCS_URL}
        target="_blank"
        rel="noreferrer"
      >
        <Github className="size-4" />
        Create token on GitHub
      </a>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm font-medium text-white/60" htmlFor="token-input">
          Personal Access Token
        </label>
        <div className="flex flex-col gap-4 sm:flex-row md:items-center">
          <div className="glass-panel flex w-full items-center gap-3 border-white/20 bg-white/10 px-4 py-3">
            <KeyRound className="size-5 shrink-0 text-brand-200" />
            <input
              id="token-input"
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-transparent text-base text-white placeholder-white/40 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-6 py-3 font-semibold text-white shadow-glow transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              'Verifying…'
            ) : (
              <span className="flex items-center gap-2">
                Continue
                <ArrowRight className="size-4" />
              </span>
            )}
          </button>
        </div>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
      </form>
    </section>
  )
}
