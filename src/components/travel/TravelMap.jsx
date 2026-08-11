import { useEffect, useMemo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Link } from 'react-router-dom'
import { Home, MapPin, Navigation } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme.jsx'
import { continentColor } from '../../data/continents.js'
import { formatMonthYear, formatVisitDates } from '../../lib/travel.js'

// CARTO basemaps: Positron in light mode, Dark Matter in dark. Both are
// OSM-derived, so both carry the same attribution as the GeoJSON map block.
const TILES = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
}
const ATTRIBUTION = '&copy; OpenStreetMap contributors &copy; CARTO'

// Pins are DivIcons rather than Leaflet's default teardrop image: a small
// filled circle carrying a lucide glyph, tinted by continent (or the marker
// accent for the two life locations). renderToStaticMarkup lets the same
// lucide icons used across the site supply the glyph markup.
function buildPin({ color, glyph, glyphColor, badge }) {
  const badgeHtml = badge ? `<i class="travel-pin__badge">${badge}</i>` : ''
  return L.divIcon({
    className: 'travel-pin-icon',
    html:
      `<span class="travel-pin" style="background:${color};color:${glyphColor}">` +
      renderToStaticMarkup(glyph) +
      `${badgeHtml}</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  })
}

const PIN_GLYPH_LIGHT = '#FAFAF9' // paper — glyph sitting on a continent tint
const ACCENT = '#F5C518' // marker.DEFAULT
const ACCENT_INK = '#17181A' // marker.ink

function ContinentTag({ continent }) {
  return (
    <span
      className="travel-popup__tag"
      style={{ color: continentColor(continent), borderColor: continentColor(continent) }}
    >
      {continent}
    </span>
  )
}

function PlacePopup({ place }) {
  const hasVisits = Boolean(place.visitDates?.length)
  const hasPosts = Boolean(place.posts?.length)

  return (
    <Popup className="travel-popup" minWidth={210} maxWidth={260} autoPanPadding={[24, 24]}>
      <p className="travel-popup__title">
        {place.city}, {place.country}
      </p>
      <ContinentTag continent={place.continent} />
      {place.summary && <p className="travel-popup__summary">{place.summary}</p>}

      {hasVisits && (
        <p className="travel-popup__meta">
          <span className="travel-popup__label">Visits:</span>{' '}
          {formatVisitDates(place.visitDates)}
        </p>
      )}

      {/* Two independent lists — no attempt to pair a post with a visit. */}
      {hasPosts && (
        <div className="travel-popup__posts">
          <p className="travel-popup__label">Writing about this place:</p>
          <ul>
            {place.posts.map((post) => (
              <li key={post.blogSlug}>
                <Link to={`/blog/${post.blogSlug}`} className="travel-popup__link">
                  <span aria-hidden="true">→</span> {post.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Popup>
  )
}

function LifePopup({ heading, location, since }) {
  return (
    <Popup className="travel-popup" minWidth={190} maxWidth={240} autoPanPadding={[24, 24]}>
      <span className="travel-popup__anchor">{heading}</span>
      <p className="travel-popup__title">
        {location.city}, {location.country}
      </p>
      {since && (
        <p className="travel-popup__meta">Based here since {formatMonthYear(since)}</p>
      )}
    </Popup>
  )
}

// Keeps the viewport honest as filters narrow the set: refit whenever the
// visible places change, rather than leaving the map parked on a region that
// no longer has any pins in it.
function FitToPlaces({ points }) {
  const map = useMap()
  const signature = points.map((p) => `${p.lat},${p.lng}`).join('|')

  useEffect(() => {
    if (!points.length) return

    const fit = () => {
      // The container is sized by CSS (vh-based), so Leaflet's first size
      // measurement can predate the real layout — without this the fitted
      // bounds are computed against a smaller box and every pin ends up
      // crammed into one corner.
      map.invalidateSize()
      if (points.length === 1) {
        map.setView([points[0].lat, points[0].lng], 5, { animate: false })
        return
      }
      map.fitBounds(
        points.map((p) => [p.lat, p.lng]),
        { padding: [56, 56], maxZoom: 6, animate: false }
      )
    }

    const frame = requestAnimationFrame(fit)
    return () => cancelAnimationFrame(frame)
    // Refit only when the *set* of visible points changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, map])

  return null
}

function PlaceMarkers({ places, lifeLocations }) {
  const map = useMap()

  // Clicking a pin flies to it (and Leaflet opens its popup as usual).
  const flyTo = (event) => {
    map.flyTo(event.latlng, Math.max(map.getZoom(), 6), { duration: 0.8 })
  }

  const { home, current } = lifeLocations

  // home/current can share coordinates with a travel entry (the current
  // residence usually *is* one of the logged places). Nudge the life pin to
  // the left in that case so both stay visible and clickable — left, so it
  // never lands on the trip pin's top-right visit-count badge.
  const offsetFor = (loc) =>
    places.some(
      (p) => Math.abs(p.lat - loc.lat) < 0.05 && Math.abs(p.lng - loc.lng) < 0.05
    )
      ? 22
      : 0

  // Icons are memoized because react-leaflet re-applies a freshly built icon
  // object on every render, which would rebuild the marker DOM (and close any
  // open popup) each time a filter or the theme changes.
  const placeIcons = useMemo(() => {
    const map = {}
    for (const place of places) {
      map[place.id] = buildPin({
        color: continentColor(place.continent),
        glyphColor: PIN_GLYPH_LIGHT,
        glyph: <MapPin size={13} strokeWidth={2.25} />,
        badge: place.visitDates?.length > 1 ? `×${place.visitDates.length}` : null,
      })
    }
    return map
  }, [places])

  const icons = useMemo(() => {
    const homeShift = offsetFor(home)
    const currentShift = offsetFor(current)
    const shifted = (icon, dx) => {
      if (!dx) return icon
      icon.options.iconAnchor = [13 + dx, 13]
      icon.options.popupAnchor = [-dx, -14]
      return icon
    }
    return {
      home: shifted(
        buildPin({
          color: ACCENT,
          glyphColor: ACCENT_INK,
          glyph: <Home size={13} strokeWidth={2.25} />,
        }),
        homeShift
      ),
      current: shifted(
        buildPin({
          color: ACCENT,
          glyphColor: ACCENT_INK,
          glyph: <Navigation size={13} strokeWidth={2.25} />,
        }),
        currentShift
      ),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home, current, places])

  return (
    <>
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={placeIcons[place.id]}
          eventHandlers={{ click: flyTo }}
          title={`${place.city}, ${place.country}`}
        >
          <PlacePopup place={place} />
        </Marker>
      ))}

      {/* The two life locations always render — they stand for the person,
          not a trip, so continent/country filters don't remove them. */}
      <Marker
        position={[home.lat, home.lng]}
        icon={icons.home}
        eventHandlers={{ click: flyTo }}
        zIndexOffset={500}
        title={`Home — ${home.city}, ${home.country}`}
      >
        <LifePopup heading="Home" location={home} />
      </Marker>
      <Marker
        position={[current.lat, current.lng]}
        icon={icons.current}
        eventHandlers={{ click: flyTo }}
        zIndexOffset={500}
        title={`Currently living — ${current.city}, ${current.country}`}
      >
        <LifePopup heading="Currently living" location={current} since={current.since} />
      </Marker>
    </>
  )
}

export default function TravelMap({ places, lifeLocations }) {
  const { theme } = useTheme()

  // Home and current residence are always on the map, so they belong in the
  // fitted bounds too — otherwise filtering to one region can leave them
  // stranded off-screen.
  const fitPoints = useMemo(
    () => [...places, lifeLocations.home, lifeLocations.current],
    [places, lifeLocations]
  )

  return (
    // `isolate` (plus the capped .leaflet-pane z-indices in index.css) keeps
    // Leaflet's internal stacking from climbing over the site's fixed nav —
    // more important here than on the small embedded GeoJSON map, since this
    // one runs the full width of the page.
    <div className="isolate overflow-hidden rounded-2xl border hairline">
      <MapContainer
        center={[35, 25]}
        zoom={3}
        minZoom={2}
        scrollWheelZoom={false}
        attributionControl
        className="travel-map"
      >
        {/* Remount on theme change so the tile URL *and* its attribution swap. */}
        <TileLayer key={theme} url={TILES[theme] || TILES.light} attribution={ATTRIBUTION} />
        <FitToPlaces points={fitPoints} />
        <PlaceMarkers places={places} lifeLocations={lifeLocations} />
      </MapContainer>
    </div>
  )
}
