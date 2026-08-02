import { useMemo } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import BlockError from './BlockError.jsx'

function collectCoordinates(coords, out) {
  if (typeof coords[0] === 'number') {
    out.push(coords)
    return
  }
  for (const c of coords) collectCoordinates(c, out)
}

function boundsOf(geojson) {
  const points = []
  const features = geojson.type === 'FeatureCollection' ? geojson.features : [geojson]
  for (const feature of features) {
    const geom = feature.geometry || feature
    if (geom?.coordinates) collectCoordinates(geom.coordinates, points)
  }
  if (!points.length) return null

  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity
  for (const [lng, lat] of points) {
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
  }
  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ]
}

export default function GeoJsonMap({ code }) {
  const data = useMemo(() => {
    try {
      return JSON.parse(code)
    } catch {
      return null
    }
  }, [code])

  const bounds = useMemo(() => (data ? boundsOf(data) : null), [data])

  if (!data) return <BlockError message="Invalid geojson JSON" />

  return (
    <div className="isolate my-6 overflow-hidden rounded-xl border hairline">
      <MapContainer
        bounds={bounds || undefined}
        center={bounds ? undefined : [0, 0]}
        zoom={bounds ? undefined : 2}
        scrollWheelZoom={false}
        style={{ height: 360, width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <GeoJSON data={data} />
      </MapContainer>
    </div>
  )
}
