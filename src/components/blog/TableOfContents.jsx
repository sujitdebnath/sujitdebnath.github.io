import { ChevronDown } from 'lucide-react'

function TocList({ headings, onNavigate }) {
  return (
    <ol className="space-y-0.5">
      {headings.map((h) => (
        <li key={h.slug} className={h.depth === 3 ? 'ml-3' : ''}>
          <a href={`#${h.slug}`} onClick={onNavigate} className="toc-link text-[13px]">
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  )
}

// Sticky sidebar — lives in the grid's left margin column, desktop only.
export function TocDesktopNav({ headings }) {
  if (!headings.length) return null

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-28 max-h-[calc(100vh-8rem)] w-[13rem] overflow-y-auto"
    >
      <p className="eyebrow mb-3">Contents</p>
      <TocList headings={headings} />
    </nav>
  )
}

// Collapsible block — lives in the content column, above the article body,
// mobile/tablet only (the sticky nav takes over at the `lg:` breakpoint).
export function TocMobileDetails({ headings }) {
  if (!headings.length) return null

  return (
    <details className="group mb-8 rounded-xl border hairline px-4 py-3 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[12px] uppercase tracking-[0.1em] text-ink dark:text-parchment">
        Contents
        <ChevronDown size={14} strokeWidth={1.75} className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3 border-t hairline pt-3">
        <TocList headings={headings} />
      </div>
    </details>
  )
}
