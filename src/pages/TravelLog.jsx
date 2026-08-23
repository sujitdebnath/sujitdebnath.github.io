import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Home, List, Map as MapIcon, Navigation } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import Dropdown from '../components/blog/Dropdown.jsx'
import TravelMap from '../components/travel/TravelMap.jsx'
import { travelLog, lifeLocations } from '../data/travelLog.js'
import { regionBounds } from '../data/mapBounds.js'
import { continentColor, continentColors } from '../data/continents.js'
import {
  formatMonthYear,
  formatPlaceName,
  formatVisitDates,
  sortByRecency,
  travelStats,
} from '../lib/travel.js'

function StatTile({ value, label }) {
  return (
    <div>
      <p className="font-display text-3xl text-ink dark:text-parchment sm:text-4xl">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint dark:text-parchment-faint">
        {label}
      </p>
    </div>
  )
}

function FilterLabel({ children }) {
  return (
    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint dark:text-parchment-faint">
      {children}
    </p>
  )
}

function ContinentTag({ continent }) {
  return (
    <span
      className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]"
      style={{ color: continentColor(continent), borderColor: continentColor(continent) }}
    >
      {continent}
    </span>
  )
}

// Round 63: a lightweight, neutral (not continent-colored, not the
// marker-yellow accent) outline pill flagging a non-city entry — same
// shape/sizing as ContinentTag, just muted instead of continent-tinted, so
// it reads as secondary context rather than competing with the continent
// pill. Omitted entirely for "city" (default) entries, not shown as a
// redundant CITY pill everywhere.
function PlaceTypeTag({ children }) {
  return (
    <span className="rounded-full border hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted dark:text-parchment-muted">
      {children}
    </span>
  )
}

// The one reusable accent-yellow dot separator used both between a place
// name and its summary (list row line 2) and between post links (line 3) —
// implemented once so the two spots can't drift into two different glyphs.
function AccentDot() {
  return (
    <span aria-hidden="true" className="mx-1.5 text-marker">
      ·
    </span>
  )
}

// Round 49: markers are the only colored thing on the map (map regions
// themselves aren't tinted), so without this the continent palette is
// illegible. A plain page row above the map, not a floating Leaflet
// control — simpler to build correctly and sidesteps the z-index issues
// Leaflet overlays have already caused elsewhere on this site.
//
// Round 50: always lists the full seven-continent palette, not just
// whichever continents currently have a travelLog entry — a continent with
// no markers yet still gets its swatch shown, just nothing on the map.
function ContinentLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {Object.keys(continentColors).map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted dark:text-parchment-muted"
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: continentColor(c) }}
            aria-hidden="true"
          />
          {c}
        </span>
      ))}
    </div>
  )
}

// Round 49: every post link runs horizontally on one line (previously
// stacked, one per line) as part of compacting each list row down to three
// lines total. Round 50: the separator between links is now the same
// accent-yellow AccentDot used between the place name and summary on line 2,
// not a plain middle dot. Round 51: more top margin than the line-1-to-2 gap
// (which was already right) so this reads as a distinct addition rather than
// crowding the name/summary line above it.
function PostLinks({ posts }) {
  return (
    <p className="mt-2.5 flex flex-wrap items-center font-mono text-[12px] text-ink dark:text-parchment">
      {posts.map((post, i) => (
        <span key={post.blogSlug} className="inline-flex items-center">
          {i > 0 && <AccentDot />}
          <Link to={`/blog/${post.blogSlug}`} className="group mark-line inline-flex items-center gap-1">
            {post.label}
            <ArrowUpRight
              size={10}
              strokeWidth={1.75}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-marker"
            />
          </Link>
        </span>
      ))}
    </p>
  )
}

// The two life locations, pinned above the chronological list and given the
// same accent treatment as their map markers so they read as "about the
// traveler" rather than as another trip.
//
// Round 51: switched from items-start (+ a manual mt-0.5 nudge on the icon)
// to items-center — the icon was sitting slightly above center against the
// two-line text block next to it. items-center vertically centers the icon
// against the block's full height instead of eyeballing an offset.
function LifeRow({ icon: Icon, heading, location, since, note }) {
  return (
    <div className="flex items-center gap-3 py-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-marker text-marker-ink">
        <Icon size={14} strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint dark:text-parchment-faint">
          <span>{heading} in </span>
          <span className="text-marker">{location.continent}</span>
        </p>
        <p className="mt-1 text-sm text-ink dark:text-parchment sm:text-base">
          {formatPlaceName(location)}
          {since && (
            <span className="text-ink-muted dark:text-parchment-muted">
              <AccentDot />
              since {formatMonthYear(since)}
            </span>
          )}
          {note && (
            <span className="text-ink-muted dark:text-parchment-muted">
              <AccentDot />
              {note}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}

// Round 65: home/current now respect the active continent/country filter
// (passed in as `null` when they don't match, per the explicit "filter them
// like normal entries" choice over "always show") — the life card box is
// omitted entirely when neither matches, rather than rendering an empty
// bordered shell.
function ListView({ places, homeLocation, currentLocation }) {
  const sorted = useMemo(() => sortByRecency(places), [places])
  const hasLifeRows = Boolean(homeLocation || currentLocation)

  return (
    <div>
      {hasLifeRows && (
        <div className="divide-y hairline rounded-2xl border hairline bg-marker/[0.04] px-4">
          {homeLocation && (
            <LifeRow icon={Home} heading="Home" location={homeLocation} note={homeLocation.note} />
          )}
          {currentLocation && (
            <LifeRow
              icon={Navigation}
              heading="Currently living"
              location={currentLocation}
              since={currentLocation.since}
              note={currentLocation.note}
            />
          )}
        </div>
      )}

      {sorted.length === 0 ? (
        <p
          className={`text-sm text-ink-muted dark:text-parchment-muted ${hasLifeRows ? 'mt-10' : ''}`}
        >
          No places match these filters yet.
        </p>
      ) : (
        // Round 49: compacted from a full blog-card-style row down to a
        // tight three-line ledger entry. Round 50: reordered — visit dates +
        // continent tag lead (line 1), the place name is now the visual
        // anchor at a slightly larger size (line 2, with the summary after
        // an AccentDot), post links trail (line 3). Lines within an entry
        // sit close together (mt-1/mt-0.5); py-3 on the row is what gives
        // adjacent entries their clearer separation via the divider below.
        <ol className={`divide-y hairline border-t hairline ${hasLifeRows ? 'mt-6' : ''}`}>
          {sorted.map((place, i) => (
            <Reveal as="li" key={place.id} delay={Math.min(i * 0.02, 0.2)}>
              <div className="py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint dark:text-parchment-faint">
                    {place.visitDates?.length
                      ? `Visited ${formatVisitDates(place.visitDates)}`
                      : 'No visit dates recorded'}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {place.placeType === 'landmark' && (
                      <PlaceTypeTag>Landmark</PlaceTypeTag>
                    )}
                    <ContinentTag continent={place.continent} />
                  </div>
                </div>
                <p className="mt-1 text-[13px] leading-snug text-ink-muted dark:text-parchment-muted">
                  <span className="font-medium text-[15px] text-ink dark:text-parchment sm:text-base">
                    {formatPlaceName(place)}
                  </span>
                  {place.summary && (
                    <>
                      <AccentDot />
                      {place.summary}
                    </>
                  )}
                </p>
                {place.posts?.length > 0 && <PostLinks posts={place.posts} />}
              </div>
            </Reveal>
          ))}
        </ol>
      )}
    </div>
  )
}

export default function TravelLog() {
  const [view, setView] = useState('map')
  const [continent, setContinent] = useState('All')
  const [country, setCountry] = useState('All')

  // Round 65: option lists now include lifeLocations.home/.current
  // alongside travelLog[] — previously only travelLog fed these, which left
  // the filters unable to select a country/continent that only exists via
  // home or current (e.g. Bangladesh, home-only in this dataset) even
  // though the stats bar above already counts it.
  const continentOptions = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set([
          ...travelLog.map((p) => p.continent),
          lifeLocations.home.continent,
          lifeLocations.current.continent,
        ])
      ).sort(),
    ],
    []
  )

  // Round 64: deliberately NOT cascaded off the continent filter, unlike
  // the Blog page's Category → Subcategory pair (that convention stays
  // as-is for blog filters; Travel Log opts out). Always every country in
  // the dataset, so picking a continent first isn't required to find one.
  const countryOptions = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set([
          ...travelLog.map((p) => p.country),
          lifeLocations.home.country,
          lifeLocations.current.country,
        ])
      ).sort(),
    ],
    []
  )

  const filtered = useMemo(
    () =>
      travelLog.filter(
        (place) =>
          (continent === 'All' || place.continent === continent) &&
          (country === 'All' || place.country === country)
      ),
    [continent, country]
  )

  // Round 65: home/current are now subject to the same continent/country
  // filter as any travelLog entry (chosen over "always visible" — see the
  // round's own explicit judgment call). `null` means "filtered out,"
  // consumed by both ListView (omit the row) and TravelMap (omit the
  // marker/fit point) below.
  const matchesFilter = (place) =>
    (continent === 'All' || place.continent === continent) &&
    (country === 'All' || place.country === country)

  const visibleLifeLocations = useMemo(
    () => ({
      home: matchesFilter(lifeLocations.home) ? lifeLocations.home : null,
      current: matchesFilter(lifeLocations.current) ? lifeLocations.current : null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [continent, country]
  )

  const hasAnyResults =
    filtered.length > 0 || Boolean(visibleLifeLocations.home) || Boolean(visibleLifeLocations.current)

  // Real geographic bounds for the active continent/country filter (country
  // wins when both are set — see regionBounds) instead of a marker-bounds
  // fit, so e.g. filtering to "Germany" frames Germany itself rather than
  // just whatever's tight around the handful of logged pins in it. Falls
  // back to `null` for combos with no entry in mapBounds.js, which leaves
  // TravelMap's own marker-bounds `autoFit` as the fit.
  const focusBounds = useMemo(() => regionBounds(continent, country), [continent, country])

  const stats = useMemo(() => travelStats(travelLog, lifeLocations), [])

  // Round 65: the country → continent lookup now checks lifeLocations too,
  // not just travelLog — needed since round 65 also made a home/current-only
  // country (e.g. Bangladesh) selectable in the first place.
  function continentForCountry(name) {
    if (lifeLocations.home.country === name) return lifeLocations.home.continent
    if (lifeLocations.current.country === name) return lifeLocations.current.continent
    return travelLog.find((p) => p.country === name)?.continent
  }

  // Round 64.2: closes the loop the other direction from round 64.1's
  // country → continent sync — changing continent now resets country back
  // to "All" only when the currently selected country actually conflicts
  // with the newly picked continent (e.g. country=India, continent changed
  // to Europe). A compatible pick (country=Germany, continent changed from
  // "All" to Europe) leaves country untouched. Together with round 64.1
  // this makes the pair mutually consistent in both directions, so the
  // "No places match these filters yet." contradictory case can no longer
  // be reached via either dropdown.
  function selectContinent(next) {
    setContinent(next)
    if (next === 'All' || country === 'All') return
    const countryContinent = continentForCountry(country)
    if (countryContinent && countryContinent !== next) {
      setCountry('All')
    }
  }

  // Round 64.1: selecting a country now syncs continent to that country's
  // actual continent (rather than round 64's original "reset to All" on a
  // mismatch) — picking India while Europe is selected moves the continent
  // filter to Asia instead of clearing it. Picking "All" for country still
  // resets continent to "All" too. The reverse (continent change) still
  // intentionally leaves country alone, unchanged from round 64.
  function selectCountry(next) {
    setCountry(next)
    if (next === 'All') {
      setContinent('All')
      return
    }
    const countryContinent = continentForCountry(next)
    if (countryContinent) {
      setContinent(countryContinent)
    }
  }

  const toggleButton = (id, label, Icon) => (
    <button
      key={id}
      type="button"
      onClick={() => setView(id)}
      aria-pressed={view === id}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
        view === id
          ? 'border-marker text-ink dark:text-parchment'
          : 'hairline text-ink-muted hover:border-marker dark:text-parchment-muted'
      }`}
    >
      <Icon size={13} strokeWidth={1.75} />
      {label}
    </button>
  )

  return (
    <div className="px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-content">
        <Reveal>
          <p className="eyebrow mb-4">[ Travel Log ]</p>
          <h1 className="font-display text-4xl text-ink dark:text-parchment sm:text-5xl">
            Places I've Been
          </h1>
          <p className="mt-5 max-w-prose text-ink-muted dark:text-parchment-muted">
            Every city I've set foot in, pinned — plus whatever I managed to write
            about it afterwards.
          </p>

          {/* Phase 4: personal framing, straight from lifeLocations. City +
              country only here (deliberately skips state) — this line is
              a compact one-liner, unlike the popup/list rows elsewhere on
              this page which use the full formatPlaceName() including
              state. */}
          <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.12em] text-ink-faint dark:text-parchment-faint">
            Based in {lifeLocations.current.city}, {lifeLocations.current.country} ·
            Originally from {lifeLocations.home.city}, {lifeLocations.home.country}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6 border-t hairline pt-6 sm:grid-cols-4">
            <StatTile value={stats.places} label="Places visited" />
            <StatTile value={stats.countries} label="Countries visited" />
            <StatTile value={stats.continents} label="Continents visited" />
            <StatTile value={stats.visits} label="Total visits" />
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <FilterLabel>View</FilterLabel>
              <div className="flex flex-wrap gap-2">
                {toggleButton('map', 'Map', MapIcon)}
                {toggleButton('list', 'List', List)}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
              <div className="sm:w-44">
                <FilterLabel>Continent</FilterLabel>
                <Dropdown
                  value={continent}
                  options={continentOptions}
                  onChange={selectContinent}
                />
              </div>
              <div className="sm:w-44">
                <FilterLabel>Country</FilterLabel>
                <Dropdown
                  value={country}
                  options={countryOptions}
                  onChange={selectCountry}
                  uppercase={false}
                />
              </div>
            </div>
          </div>

          {view === 'map' && (
            <div className="mt-5">
              <ContinentLegend />
            </div>
          )}

          <div className="mt-4">
            {view === 'map' ? (
              !hasAnyResults ? (
                <p className="text-sm text-ink-muted dark:text-parchment-muted">
                  No places match these filters yet.
                </p>
              ) : (
                // Round 56: reverses the round-50 full-bleed treatment — a
                // map that has to correctly fit-and-zoom at *any* viewport
                // width (phone to ultrawide monitor) turned out to be
                // inherently unstable (rounds 52-55). Bounded to a modest
                // max-width instead, matching the site's existing breakout
                // math (img-large: content column ±7rem at lg:) — here ±6rem
                // against the max-w-content (68rem) column reaches exactly
                // 80rem, centered the same way since equal margins on both
                // sides don't shift the horizontal center. The "I want it
                // bigger" case is covered by the fullscreen toggle inside
                // TravelMap itself instead.
                <div className="lg:-ml-[6rem] lg:-mr-[6rem] lg:w-[calc(100%+12rem)]">
                  <TravelMap
                    places={filtered}
                    lifeLocations={visibleLifeLocations}
                    autoFit={continent !== 'All' || country !== 'All'}
                    focusBounds={focusBounds}
                  />
                </div>
              )
            ) : (
              <ListView
                places={filtered}
                homeLocation={visibleLifeLocations.home}
                currentLocation={visibleLifeLocations.current}
              />
            )}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
