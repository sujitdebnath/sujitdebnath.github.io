import { useEffect, useRef } from 'react'
import { create } from '../../../lib/vendor/typograms.js'

export default function TypogramsBlock({ code }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''
    const svg = create(`\n${code}\n`, 0.85, false)
    svg.style.maxWidth = '100%'
    svg.style.height = 'auto'
    containerRef.current.appendChild(svg)
  }, [code])

  return (
    <div
      className="typogram-block my-6 flex justify-center overflow-x-auto rounded-xl border hairline p-4"
      ref={containerRef}
    />
  )
}
