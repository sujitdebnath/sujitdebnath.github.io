import { useEffect } from 'react'

const TIKZJAX_SRC = 'https://tikzjax.com/v1/tikzjax.js'

// TikZJax scans the DOM for <script type="text/tikz"> tags and replaces
// them with rendered SVG once its (large, WASM-backed) script has loaded.
// Only injected when a post's raw body actually contains a TikZ block.
export default function TikZLoader({ active }) {
  useEffect(() => {
    if (!active) return undefined
    const script = document.createElement('script')
    script.src = TIKZJAX_SRC
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [active])

  return null
}
