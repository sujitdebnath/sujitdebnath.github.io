import { useEffect, useRef } from 'react'
import { html } from 'diff2html'
import 'diff2html/bundles/css/diff2html.min.css'

export default function Diff2HtmlBlock({ code }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const isDark = document.documentElement.classList.contains('dark')
    containerRef.current.innerHTML = html(code, {
      drawFileList: true,
      matching: 'lines',
      outputFormat: 'line-by-line',
      colorScheme: isDark ? 'dark' : 'light',
    })
  }, [code])

  return <div className="diff2html-block my-6 overflow-x-auto rounded-xl border hairline" ref={containerRef} />
}
