import { useMemo } from 'react'
import Plotly from 'plotly.js-dist-min'
import createPlotlyComponent from 'react-plotly.js/factory'
import BlockError from './BlockError.jsx'

const Plot = createPlotlyComponent(Plotly)

export default function PlotlyBlock({ code }) {
  const spec = useMemo(() => {
    try {
      return JSON.parse(code)
    } catch {
      return null
    }
  }, [code])

  if (!spec) return <BlockError message="Invalid plotly JSON" />

  return (
    <div className="my-6 overflow-x-auto rounded-xl border hairline p-2">
      <Plot
        data={spec.data}
        layout={{ autosize: true, ...spec.layout }}
        config={{ displayModeBar: false, responsive: true, ...spec.config }}
        style={{ width: '100%' }}
        useResizeHandler
      />
    </div>
  )
}
