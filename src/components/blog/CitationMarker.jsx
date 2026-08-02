import { useState } from 'react'

export default function CitationMarker({ id, number, entry }) {
  const [hover, setHover] = useState(false)

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <a
        href={`#ref-${id}`}
        className="mx-0.5 align-super font-mono text-[0.75em] text-marker hover:underline"
      >
        [{number}]
      </a>
      {hover && entry && (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg border hairline bg-paper-surface p-3 text-left align-baseline text-xs normal-case leading-relaxed text-ink shadow-lg dark:bg-night-surface dark:text-parchment">
          <span className="block font-semibold">{entry.title}</span>
          {entry.authors && (
            <span className="mt-1 block text-ink-muted dark:text-parchment-muted">{entry.authors}</span>
          )}
          {entry.year && (
            <span className="mt-1 block text-ink-faint dark:text-parchment-faint">{entry.year}</span>
          )}
        </span>
      )}
    </span>
  )
}
