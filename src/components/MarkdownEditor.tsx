import { useMemo, useState } from 'react'
import type { PluggableList } from 'unified'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { ClipboardCopy, Check, Eye } from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'details', 'summary', 'div', 'img', 'a'],
  attributes: {
    ...defaultSchema.attributes,
    div: ['id', 'align', 'className', 'style'],
    details: ['open'],
    img: ['src', 'alt', 'width', 'height', 'loading', 'style'],
    a: ['href', 'target', 'rel'],
  },
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [copied, setCopied] = useState(false)
  const rehypePlugins = useMemo<PluggableList>(
    () => [rehypeRaw, [rehypeSanitize, schema]],
    [],
  )

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="glass-panel flex h-[32rem] flex-col border-white/10 bg-[#05060f]">
        <header className="flex items-center justify-between border-b border-white/5 px-4 py-3 text-sm text-white/60">
          <span>Markdown template</span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1 text-xs"
          >
            {copied ? (
              <>
                <Check className="size-3 text-emerald-300" /> Copied
              </>
            ) : (
              <>
                <ClipboardCopy className="size-3" /> Copy
              </>
            )}
          </button>
        </header>
        <textarea
          className="flex-1 bg-transparent p-4 font-mono text-sm text-white/90 focus:outline-none"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Raw README markdown"
          placeholder="Markdown will appear here once analysis completes"
        />
      </div>
      <div className="glass-panel h-[32rem] overflow-y-auto border-white/10 bg-white/95 p-4 text-slate-900">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
          <Eye className="size-3" /> Live preview
        </div>
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={rehypePlugins}>
            {value}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  )
}
