import { lazy } from 'react'

// Registry of fenced-code-block language -> lazily-loaded renderer.
// Each entry is its own React.lazy boundary, so a post using only (say)
// Mermaid never pulls in Leaflet, Vega, Plotly, etc.
export const blockRenderers = {
  mermaid: lazy(() => import('./Mermaid.jsx')),
  chartjs: lazy(() => import('./ChartJsBlock.jsx')),
  echarts: lazy(() => import('./EChartsBlock.jsx')),
  vega_lite: lazy(() => import('./VegaLiteBlock.jsx')),
  diff2html: lazy(() => import('./Diff2HtmlBlock.jsx')),
  geojson: lazy(() => import('./GeoJsonMap.jsx')),
  typograms: lazy(() => import('./TypogramsBlock.jsx')),
  plotly: lazy(() => import('./PlotlyBlock.jsx')),
}
