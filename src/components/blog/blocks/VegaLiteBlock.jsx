import { useEffect, useMemo, useRef, useState } from 'react'
import vegaEmbed from 'vega-embed'
import BlockError from './BlockError.jsx'

export default function VegaLiteBlock({ code }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)
  const spec = useMemo(() => {
    try {
      return JSON.parse(code)
    } catch {
      return null
    }
  }, [code])

  useEffect(() => {
    if (!spec || !containerRef.current) return undefined
    let view
    let cancelled = false

    const isDark = document.documentElement.classList.contains('dark')
    const textColor = isDark ? '#F1EFE8' : '#17181A'
    const gridColor = isDark ? '#2B2C2E' : '#E4E3DE'
    const themedSpec = {
      ...spec,
      background: 'transparent',
      config: {
        ...spec.config,
        background: 'transparent',
        title: { color: textColor, ...spec.config?.title },
        axis: {
          labelColor: textColor,
          titleColor: textColor,
          domainColor: gridColor,
          tickColor: gridColor,
          gridColor,
          ...spec.config?.axis,
        },
        legend: { labelColor: textColor, titleColor: textColor, ...spec.config?.legend },
        view: { stroke: 'transparent', ...spec.config?.view },
      },
    }

    vegaEmbed(containerRef.current, themedSpec, { actions: false })
      .then((result) => {
        if (cancelled) result.view.finalize()
        else view = result.view
      })
      .catch((err) => !cancelled && setError(String(err?.message || err)))

    return () => {
      cancelled = true
      view?.finalize()
    }
  }, [spec])

  if (!spec) return <BlockError message="Invalid vega_lite JSON" />
  if (error) return <BlockError message={error} />

  return <div className="my-6 overflow-x-auto rounded-xl border hairline p-4" ref={containerRef} />
}
