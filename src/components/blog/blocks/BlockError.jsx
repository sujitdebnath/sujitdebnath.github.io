export default function BlockError({ message }) {
  return (
    <div className="my-6 rounded-xl border hairline p-4 text-sm text-ink-muted dark:text-parchment-muted">
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-marker">Render error</span>
      <p className="mt-1">{message}</p>
    </div>
  )
}
