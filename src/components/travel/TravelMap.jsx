import { useEffect, useMemo, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvent } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Link } from 'react-router-dom'
import { Home, Maximize, Minimize, MapPin, Navigation } from 'lucide-react'
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
// space. `.travel-map` briefly used `aspect-ratio: 2/1` to tie height to
// width instead — round 55 replaced that with a viewport-height-driven
// clamp() (see index.css), since tying height to width just traded one
// coupling for another (too tall on wide monitors, too short — and
// edge-clipping — on narrow windows).
//
// Round 56: rounds 52-55 were all fixes to symptoms of the same root cause —
// a map that has to correctly fit-and-zoom at *any* viewport width (phone to
// ultrawide monitor) is inherently unstable. Round 50's full-bleed treatment
// is reversed here: the map is back to a bounded, modest max-width (see
// TravelLog.jsx), so its container size varies within a much narrower,
// predictable range. A fullscreen toggle (below) covers the "I want it
// bigger" case instead, without making the *default* embedded state fight
// for stability across the entire viewport-width spectrum.
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

// Round 57: places get highlighted at *their own* location on click, not
// their country's — a bundled country-borders dataset was tried first and
// dropped (see git history) because that's the wrong granularity entirely:
// clicking Nürnberg could only ever highlight all of Germany with it, never
// the city itself. Round 58: a per-place real-boundary override (also see
// git history) was tried next and dropped too — too much manual upkeep for
// the benefit. Just this one fixed-radius circle, every time: small enough
// to read as "here, specifically," not "this whole region" (a 30km fallback
// radius read as covering a huge swath of the surrounding area in practice).
const HIGHLIGHT_RADIUS_METERS = 750

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
      {/* Round 57: tag-above-heading, matching the eyebrow-above-title
          pattern used everywhere else on the site — was two evenly-spaced
          lines (title first, tag after) with too much gap between them. */}
      <ContinentTag continent={place.continent} />
      <p className="travel-popup__title">
        {place.city}, {place.country}
      </p>
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
// recomputed on mount *and* whenever the map's own container changes size; a
// stale fit from a previous size would reintroduce the repeated-world-copy
// bug this replaced a hardcoded center/zoom to fix (see WORLD_BOUNDS above).
//
// Round 53: a plain `window.resize` listener isn't enough — the container's
// rendered size can change without the window itself resizing. A
// ResizeObserver on the map's own container element reacts to its actual
// size changing for any reason — not just whole-window resizes, but also
// (round 56) toggling the fullscreen overlay on/off, which swaps the
// container between the bounded embedded size and the full viewport without
// any extra wiring needed here: the class change alone triggers this
// observer.
function FitToView({ points, active }) {
  const map = useMap()
  const signature = points.map((p) => `${p.lat},${p.lng}`).join('|')

  useEffect(() => {
    const fit = () => {
      // Round 55: invalidateSize MUST run before fitBounds/setView, every
      // time — Leaflet caches the container's pixel size internally and
      // won't notice a CSS-driven change (or that layout has now settled)
      // on its own, so skipping this fits against a stale size, which
      // showed up as both inconsistent edge-clipping and a zoom that felt
      // like it jumped too far per step. This is also why MapContainer no
      // longer gets a `bounds` prop directly (see below) — that path called
      // fitBounds without this invalidateSize sequencing at all.
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
// means here: clear whatever place is currently highlighted.
function ClearSelectionOnMapClick({ onClear }) {
  useMapEvent('click', onClear)
  return null
}

function PlaceMarkers({ places, lifeLocations, onSelect }) {
  const map = useMap()

  // Clicking a pin flies to it (Leaflet opens its popup as usual) and
  // highlights that place with a small circle.
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

// Outlines the selected place itself — a small fixed-radius circle centered
// exactly on its lat/lng. No fill or a very faint one, in the place's own
// marker color (continent tint, or the marker accent for home/current).
function PlaceHighlight({ selected }) {
  if (!selected) return null
  const { place, color } = selected

  return (
    <Circle
      // A composite key (not just place.id — lifeLocations.home/current
      // don't have one) so Leaflet remounts the circle cleanly between
      // places instead of trying to animate/diff between two positions.
      key={`${place.city}-${place.country}`}
      center={[place.lat, place.lng]}
      radius={HIGHLIGHT_RADIUS_METERS}
      interactive={false}
      pathOptions={{ color, weight: 2, opacity: 0.9, fillColor: color, fillOpacity: 0.06 }}
    />
  )
}

export default function TravelMap({ places, lifeLocations, autoFit }) {
  const { theme } = useTheme()
  const [selected, setSelected] = useState(null) // { place, color } | null
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Home and current residence are always on the map, so they belong in the
  // fitted bounds too — otherwise filtering to one region can leave them
  // stranded off-screen.
  const fitPoints = useMemo(
    () => [...places, lifeLocations.home, lifeLocations.current],
    [places, lifeLocations]
  )

  // The highlight circle is scoped to whatever's currently visible — if a
  // filter change (or toggling back from List) changes the marker set,
  // clear it rather than leaving a circle for a place that may no longer be
  // on screen.
  useEffect(() => {
    setSelected(null)
  }, [places, lifeLocations])

  const selectPlace = (place) =>
    setSelected({
      place,
      color: place === lifeLocations.home || place === lifeLocations.current
        ? ACCENT
        : continentColor(place.continent),
    })

  return (
    // `isolate` (plus the capped .leaflet-pane z-indices in index.css) keeps
    // Leaflet's internal stacking from climbing over the site's fixed nav.
    // Round 56: the map is bounded/embedded again (see TravelLog.jsx), so the
    // rounded/border card chrome round 50 dropped for the full-bleed
    // treatment comes back — it's no longer sitting flush against the
    // viewport edge. In fullscreen, `fixed inset-0` overrides all of that:
    // square corners, no border, covering literally everything (z-[100],
    // above the fixed nav's z-50) with an explicit background so nothing
    // behind it can show through before the tiles paint.
    <div
      className={
        isFullscreen
          ? 'travel-map-wrap--fullscreen fixed inset-0 z-[100] isolate overflow-hidden bg-paper dark:bg-night'
          : 'relative isolate overflow-hidden rounded-2xl border hairline'
      }
    >
      <button
        type="button"
        onClick={() => setIsFullscreen((f) => !f)}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'View map fullscreen'}
        className="absolute right-3 top-3 z-[1000] flex h-9 w-9 items-center justify-center rounded-full border hairline bg-paper-surface text-ink-muted shadow-sm transition-colors hover:text-ink dark:bg-night-surface dark:text-parchment-muted dark:hover:text-parchment"
      >
        {isFullscreen ? (
          <Minimize size={16} strokeWidth={1.75} />
        ) : (
          <Maximize size={16} strokeWidth={1.75} />
        )}
      </button>
      <MapContainer
        // Round 55: this used to be `bounds={WORLD_BOUNDS}`, which made
        // react-leaflet call fitBounds internally at map-creation time — a
        // *second*, unsequenced fitBounds call that runs before FitToView's
        // effect gets a chance to invalidateSize() first, so it could fit
        // against a stale/pre-layout container size (compounding the
        // edge-clipping bug this round fixes). center/zoom here are just a
        // valid, cheap initial state — FitToView below immediately replaces
        // it with the real, correctly-sequenced (invalidateSize-then-fit)
        // world view on the very next frame, so the exact numbers barely
        // matter.
        center={[20, 10]}
        zoom={2}
        // Round 56: at the new bounded container size, a plain fitBounds to
        // WORLD_BOUNDS landed noticeably more zoomed-out than the reference
        // (no country names legible) — minZoom=3 is a floor that keeps the
        // world view at a more legible zoom level, exactly as anticipated.
        // Safe against the repeated-world-copy bug rounds 52/53 fixed: at
        // zoom 3 the world is already wider (2048px) than this container's
        // ~1280px max-width, so this floor only ever zooms *in* relative to
        // what a bare fit would pick, never creates leftover horizontal room.
        minZoom={3}
        zoomSnap={0.25}
        maxBounds={MAX_BOUNDS}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        scrollWheelZoom
        attributionControl
        // react-leaflet only applies `className` once, at initial map
        // construction — it does not reactively re-sync on later renders.
        // So the fullscreen-vs-embedded height swap (index.css) is scoped
        // through the *wrapper* div's class instead (which is a plain,
        // reactive element), not through toggling this prop.
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
        <PlaceHighlight selected={selected} />
      </MapContainer>
    </div>
  )
}
