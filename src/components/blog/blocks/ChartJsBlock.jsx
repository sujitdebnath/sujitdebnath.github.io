import { useMemo } from 'react'
import { Chart, registerables } from 'chart.js'
import { Chart as ChartComponent } from 'react-chartjs-2'
import BlockError from './BlockError.jsx'

Chart.register(...registerables)

export default function ChartJsBlock({ code }) {
  const config = useMemo(() => {
    try {
      return JSON.parse(code)
    } catch {
      return null
    }
  }, [code])

  if (!config) return <BlockError message="Invalid chartjs JSON" />

  return (
    <div className="my-6 rounded-xl border hairline p-4">
      <ChartComponent type={config.type} data={config.data} options={config.options} />
    </div>
  )
}
