import { useEffect, useMemo, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap, useMapEvent } from 'react-leaflet'
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

// Default view (round 49, fixed in round 50/52): the whole world, not a
// bounds-fit to the current markers — that left the map opening already
// zoomed into the Europe cluster since most of the placeholder data lives
// there. Filtering to a continent/country still fits bounds to the narrowed
// set (see `autoFit` below); only the fully unfiltered view uses this.
//
// Round 52: this used to be a hardcoded `center`/`zoom` pair, which broke
// once the map went full-bleed (round 50) — at the new, much wider container
// width, that fixed zoom level shows more than one world's-width of
// horizontal space, and Leaflet fills the leftover room by tiling repeated
// copies of the map side by side. A *fitted* bounds is immune to this by
// definition: whatever the container's actual pixel dimensions are, fitBounds
// computes the zoom that shows exactly that bounds with no leftover space —
// see FitToView below, which does this fit dynamically (on mount and on
// resize) rather than hardcoding a zoom number that only happens to work at
// one specific width. Cropped to exclude most of Antarctica so the rest of
// the world renders bigger/more legible.
//
// Round 53: the dynamic fit alone still wasn't sufficient — the container's
// CSS height (index.css `.travel-map`) was a fixed vh value independent of
// its full-bleed width, so at wide-but-short viewport proportions the height
// became a *tighter* constraint than the width, forcing fitBounds to zoom
// out further than the width needed and reintroducing the same leftover
// space. `.travel-map` now uses `aspect-ratio: 2/1` (matching these bounds'
// natural aspect) so height always scales with width instead.
const WORLD_BOUNDS = [
  [-58, -170],
  [78, 170],
]

// Keeps panning from dragging the view into repeated-world-copy territory
// too — the dynamic fit above handles the initial/resized view, this handles
// it staying correct during interaction (paired with worldCopyJump={false}
// and maxBoundsViscosity on MapContainer below).
const MAX_BOUNDS = [
  [-90, -180],
  [90, 180],
]

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

// Our travelLog/lifeLocations country names don't always match the bundled
// GeoJSON's own naming (public/data/world-countries.geojson, trimmed from
// Natural Earth's public-domain 110m admin-0 countries dataset). Add an
// entry here if a newly added country's border fails to highlight — check
// the `name` property in that file for the exact spelling it expects.
const COUNTRY_NAME_OVERRIDES = {
  'Czech Republic': 'Czechia',
}

function findCountryFeature(data, countryName) {
  if (!data || !countryName) return null
  const target = (COUNTRY_NAME_OVERRIDES[countryName] || countryName).toLowerCase()
  return data.features.find((f) => f.properties.name?.toLowerCase() === target) || null
}

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
// no longer has any pins in it. When no filter is active, fits the fixed
// WORLD_BOUNDS default instead (round 52) — in both cases the fit is
// recomputed on mount *and* whenever the map's own container changes size,
// since this is now a responsive full-bleed element (round 50) whose actual
// pixel dimensions change across screen sizes and layouts; a stale fit from
// a previous size would reintroduce the repeated-world-copy bug this
// replaced a hardcoded center/zoom to fix (see WORLD_BOUNDS above).
//
// Round 53: a plain `window.resize` listener isn't enough — the container's
// rendered size can change without the window itself resizing (e.g. the
// aspect-ratio-based height from index.css recalculating as layout above it
// shifts). A ResizeObserver on the map's own container element reacts to its
// actual size changing for any reason, not just whole-window resize events.
function FitToView({ points, active }) {
  const map = useMap()
  const signature = points.map((p) => `${p.lat},${p.lng}`).join('|')

  useEffect(() => {
    const fit = () => {
      // The container can still be mid-layout on the very first call, so
      // invalidateSize before every fit rather than trusting a cached size.
      map.invalidateSize()
      if (active && points.length === 1) {
        map.setView([points[0].lat, points[0].lng], 5, { animate: false })
      } else if (active && points.length > 1) {
        map.fitBounds(
          points.map((p) => [p.lat, p.lng]),
          { padding: [56, 56], maxZoom: 6, animate: false }
        )
      } else {
        map.fitBounds(WORLD_BOUNDS, { animate: false })
      }
    }

    const frame = requestAnimationFrame(fit)
    const observer = new ResizeObserver(fit)
    observer.observe(map.getContainer())

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
    // Refit when the visible point set or fit-mode changes; the
    // ResizeObserver above covers size changes to the current fit target.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, map, active])

  return null
}

// Clicking empty map background (not a marker — Leaflet stops marker click
// events from bubbling to the map) is what "returning to the default view"
// means here: clear whatever country border is currently highlighted.
function ClearSelectionOnMapClick({ onClear }) {
  useMapEvent('click', onClear)
  return null
}

function PlaceMarkers({ places, lifeLocations, onSelect }) {
  const map = useMap()

  // Clicking a pin flies to it (Leaflet opens its popup as usual) and
  // highlights that place's country border.
  const flyTo = (event, place) => {
    map.flyTo(event.latlng, Math.max(map.getZoom(), 6), { duration: 0.8 })
    onSelect(place)
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
          eventHandlers={{ click: (e) => flyTo(e, place) }}
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
        eventHandlers={{ click: (e) => flyTo(e, home) }}
        zIndexOffset={500}
        title={`Home — ${home.city}, ${home.country}`}
      >
        <LifePopup heading="Home" location={home} />
      </Marker>
      <Marker
        position={[current.lat, current.lng]}
        icon={icons.current}
        eventHandlers={{ click: (e) => flyTo(e, current) }}
        zIndexOffset={500}
        title={`Currently living — ${current.city}, ${current.country}`}
      >
        <LifePopup heading="Currently living" location={current} since={current.since} />
      </Marker>
    </>
  )
}

// Outlines a single country's boundary — no fill or a very faint one, in the
// selected place's own marker color (continent tint, or the marker accent
// for home/current). Fetched once per map mount and cached in state; a
// missing/unmatched country name just renders nothing (see
// COUNTRY_NAME_OVERRIDES above for handling a mismatch).
function CountryHighlight({ selected }) {
  const [countries, setCountries] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}data/world-countries.geojson`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setCountries(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const feature = useMemo(
    () => (selected ? findCountryFeature(countries, selected.country) : null),
    [countries, selected]
  )

  if (!feature) return null

  return (
    <GeoJSON
      // Remount per country so Leaflet swaps geometry/style cleanly instead
      // of trying to diff two unrelated polygons.
      key={selected.country}
      data={feature}
      interactive={false}
      style={{ color: selected.color, weight: 2, opacity: 0.9, fillColor: selected.color, fillOpacity: 0.06 }}
    />
  )
}

export default function TravelMap({ places, lifeLocations, autoFit }) {
  const { theme } = useTheme()
  const [selected, setSelected] = useState(null) // { country, color } | null

  // Home and current residence are always on the map, so they belong in the
  // fitted bounds too — otherwise filtering to one region can leave them
  // stranded off-screen.
  const fitPoints = useMemo(
    () => [...places, lifeLocations.home, lifeLocations.current],
    [places, lifeLocations]
  )

  // The highlighted border is scoped to whatever's currently visible — if a
  // filter change (or toggling back from List) changes the marker set,
  // clear it rather than leaving a border for a place that may no longer be
  // on screen.
  useEffect(() => {
    setSelected(null)
  }, [places, lifeLocations])

  const selectPlace = (place) =>
    setSelected({
      country: place.country,
      color: place === lifeLocations.home || place === lifeLocations.current
        ? ACCENT
        : continentColor(place.continent),
    })

  return (
    // `isolate` (plus the capped .leaflet-pane z-indices in index.css) keeps
    // Leaflet's internal stacking from climbing over the site's fixed nav —
    // more important here than on the small embedded GeoJSON map, since this
    // one runs the full width of the page. Round 50: the page now renders
    // this full-bleed (see TravelLog.jsx), so — matching the site's existing
    // img-full convention — it drops the boxed rounded/border chrome that
    // made sense at content-column width; rounded corners sitting right at
    // the viewport edge would just look clipped/broken.
    <div className="isolate overflow-hidden">
      <MapContainer
        bounds={WORLD_BOUNDS}
        minZoom={2}
        maxBounds={MAX_BOUNDS}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        scrollWheelZoom
        attributionControl
        className="travel-map"
      >
        {/* Remount on theme change so the tile URL *and* its attribution swap.
            noWrap is a second, independent line of defense against repeated
            world copies (round 52/53): even with a correctly-fitted zoom,
            it stops Leaflet from ever tiling extra copies into whatever
            sliver of horizontal space might still be left over, e.g. during
            a resize's transient in-between frames. */}
        <TileLayer
          key={theme}
          url={TILES[theme] || TILES.light}
          attribution={ATTRIBUTION}
          noWrap
        />
        <FitToView points={fitPoints} active={autoFit} />
        <PlaceMarkers places={places} lifeLocations={lifeLocations} onSelect={selectPlace} />
        <ClearSelectionOnMapClick onClear={() => setSelected(null)} />
        <CountryHighlight selected={selected} />
      </MapContainer>
    </div>
  )
}
