import { CheckCircle2, CircleDashed, TerminalSquare, XCircle } from 'lucide-react'
import type { TerminalLogEntry } from '../types/github'

interface TerminalLogProps {
  title?: string
  logs: TerminalLogEntry[]
}

export function TerminalLog({ title = 'Intelligent analysis feed', logs }: TerminalLogProps) {
  const renderIcon = (status: TerminalLogEntry['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="size-5 text-emerald-400" />
      case 'error':
        return <XCircle className="size-5 text-red-400" />
      default:
        return <CircleDashed className="size-5 animate-spin text-white/40" />
    }
  }

  return (
    <section className="glass-panel flex h-80 flex-col overflow-hidden border-white/10 bg-white/5">
      <header className="flex items-center gap-2 border-b border-white/5 px-5 py-3 text-sm uppercase tracking-[0.3em] text-white/50">
        <TerminalSquare className="size-4" />
        {title}
      </header>
      <div className="flex-1 overflow-y-auto bg-[#05060f] px-5 py-4 font-mono text-sm text-white scrollbar-thin">
        {logs.length === 0 ? (
          <p className="text-white/40">Waiting for API calls…</p>
        ) : (
          <ul className="space-y-3">
            {logs.map((log) => (
              <li key={log.id} className="flex items-center gap-3">
                {renderIcon(log.status)}
                <div>
                  <p>{log.label}</p>
                  <p className="text-xs text-white/40">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
