import { Suspense } from 'react'
import { getNodeText } from '../../lib/markdownPipeline.js'
import { blockRenderers } from './blocks/index.js'

function languageOf(className) {
  const match = /language-(\S+)/.exec(className || '')
  return match?.[1]
}

const BlockFallback = () => (
  <div className="my-6 flex h-40 items-center justify-center rounded-xl border hairline font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint dark:text-parchment-faint">
    Loading…
  </div>
)

// `pre` and `code` are overridden together: a fenced block whose language
// matches an entry in `blockRenderers` skips the <pre> wrapper entirely and
// renders the rich block instead (mermaid diagram, chart, map, ...); every
// other code path (inline code, plain/highlighted fenced code) renders as usual.
export function CodePre({ children, node }) {
  const codeNode = node?.children?.[0]
  const lang = languageOf(codeNode?.properties?.className?.join(' '))
  // The `bibliography` block is post metadata (parsed separately for the
  // citation/References system), not something to display in the article body.
  if (lang === 'bibliography') return null
  if (lang && blockRenderers[lang]) return children
  return (
    <pre className="my-6 overflow-x-auto rounded-xl border hairline bg-paper-surface p-4 text-[0.85em] leading-relaxed dark:bg-night-surface">
      {children}
    </pre>
  )
}

export function CodeInline({ className, children, ...props }) {
  const lang = languageOf(className)

  if (!lang) {
    return (
      <code
        className="rounded bg-paper-surface px-1.5 py-0.5 font-mono text-[0.9em] text-ink dark:bg-night-surface dark:text-parchment"
        {...props}
      >
        {children}
      </code>
    )
  }

  const Renderer = blockRenderers[lang]
  if (Renderer) {
    const source = getNodeText(children).replace(/\n$/, '')
    return (
      <Suspense fallback={<BlockFallback />}>
        <Renderer code={source} />
      </Suspense>
    )
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}
