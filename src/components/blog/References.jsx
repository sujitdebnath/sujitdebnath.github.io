export default function References({ bibliography, citationOrder }) {
  const entries = [...citationOrder.entries()]
    .sort((a, b) => a[1] - b[1])
    .map(([id, number]) => ({ id, number, ...bibliography.get(id) }))
    .filter((entry) => entry.title)

  if (!entries.length) return null

  return (
    <section className="mt-14 border-t hairline pt-8">
      <p className="eyebrow mb-4">References</p>
      <ol className="space-y-5">
        {entries.map((entry) => (
          <li key={entry.id} id={`ref-${entry.id}`} className="scroll-mt-24 text-sm">
            <h4 className="font-display text-base leading-snug text-ink dark:text-parchment">
              <span className="mr-1.5 font-mono text-xs text-ink-faint dark:text-parchment-faint">
                [{entry.number}]
              </span>
              {entry.title}
            </h4>
            {entry.authors && (
              <p className="mt-1.5 text-sm text-ink-muted dark:text-parchment-muted">{entry.authors}</p>
            )}
            {(entry.venue || entry.year) && (
              <p className="mt-1 text-sm italic text-ink-muted dark:text-parchment-muted">
                {entry.venue}
                {entry.venue && entry.year && ', '}
                {entry.year}
              </p>
            )}
            {entry.url && (
              <a
                href={entry.url}
                target="_blank"
                rel="noreferrer"
                className="mark-line mt-2 inline-flex items-center gap-1 font-mono text-[12px] text-ink dark:text-parchment"
              >
                View source
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
