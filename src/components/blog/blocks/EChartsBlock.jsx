import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import BlockError from './BlockError.jsx'

export default function EChartsBlock({ code }) {
  const option = useMemo(() => {
    try {
      return JSON.parse(code)
    } catch {
      return null
    }
  }, [code])

  if (!option) return <BlockError message="Invalid echarts JSON" />

  return (
    <div className="my-6 rounded-xl border hairline p-4">
      <ReactECharts option={option} style={{ height: 360 }} />
    </div>
  )
}
