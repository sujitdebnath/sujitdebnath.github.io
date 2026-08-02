import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import BlockError from './BlockError.jsx'

export default function Mermaid({ code }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const isDark = document.documentElement.classList.contains('dark')
    mermaid.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'default', fontFamily: 'inherit' })

    const id = `mermaid-${Math.random().toString(36).slice(2)}`
    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (!cancelled && containerRef.current) containerRef.current.innerHTML = svg
      })
      .catch((err) => {
        if (!cancelled) setError(String(err?.message || err))
      })

    return () => {
      cancelled = true
    }
  }, [code])

  if (error) return <BlockError message={error} />

  return (
    <div
      className="my-6 flex justify-center overflow-x-auto rounded-xl border hairline p-4"
      ref={containerRef}
    />
  )
}
