import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Home, List, Map as MapIcon, Navigation } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import Dropdown from '../components/blog/Dropdown.jsx'
import TravelMap from '../components/travel/TravelMap.jsx'
import { travelLog, lifeLocations } from '../data/travelLog.js'
import { continentColor, continentColors } from '../data/continents.js'
import { formatMonthYear, formatVisitDates, sortByRecency, travelStats } from '../lib/travel.js'

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
          {heading}
        </p>
        <p className="mt-1 text-sm text-ink dark:text-parchment sm:text-base">
          {location.city}, {location.country}
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

function ListView({ places }) {
  const sorted = useMemo(() => sortByRecency(places), [places])

  return (
    <div>
      <div className="divide-y hairline rounded-2xl border hairline bg-marker/[0.04] px-4">
        <LifeRow
          icon={Home}
          heading="Home"
          location={lifeLocations.home}
          note={lifeLocations.home.note}
        />
        <LifeRow
          icon={Navigation}
          heading="Currently living"
          location={lifeLocations.current}
          since={lifeLocations.current.since}
          note={lifeLocations.current.note}
        />
      </div>

      {sorted.length === 0 ? (
        <p className="mt-10 text-sm text-ink-muted dark:text-parchment-muted">
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
        <ol className="mt-6 divide-y hairline border-t hairline">
          {sorted.map((place, i) => (
            <Reveal as="li" key={place.id} delay={Math.min(i * 0.02, 0.2)}>
              <div className="py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint dark:text-parchment-faint">
                    {place.visitDates?.length
                      ? `Visited ${formatVisitDates(place.visitDates)}`
                      : 'No visit dates recorded'}
                  </p>
                  <ContinentTag continent={place.continent} />
                </div>
                <p className="mt-1 text-[13px] leading-snug text-ink-muted dark:text-parchment-muted">
                  <span className="font-medium text-[15px] text-ink dark:text-parchment sm:text-base">
                    {place.city}, {place.country}
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

  const continentOptions = useMemo(
    () => ['All', ...Array.from(new Set(travelLog.map((p) => p.continent))).sort()],
    []
  )

  // Cascades off the continent, same as the Blog page's Category →
  // Subcategory pair: only the countries present inside the current continent.
  const countryOptions = useMemo(() => {
    if (continent === 'All') return ['All']
    const inContinent = travelLog.filter((p) => p.continent === continent)
    return ['All', ...Array.from(new Set(inContinent.map((p) => p.country))).sort()]
  }, [continent])

  const filtered = useMemo(
    () =>
      travelLog.filter(
        (place) =>
          (continent === 'All' || place.continent === continent) &&
          (country === 'All' || place.country === country)
      ),
    [continent, country]
  )

  const stats = useMemo(() => travelStats(travelLog, lifeLocations), [])

  function selectContinent(next) {
    setContinent(next)
    setCountry('All')
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

          {/* Phase 4: personal framing, straight from lifeLocations. */}
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
                  onChange={setCountry}
                  disabled={continent === 'All'}
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
              filtered.length === 0 ? (
                <p className="text-sm text-ink-muted dark:text-parchment-muted">
                  No places match these filters yet.
                </p>
              ) : (
                // Full-bleed breakout: same w-screen + left-1/2 + negative-margin
                // technique as img-full/l-screen elsewhere on the site, so the
                // map spans (near enough) the full viewport while the header,
                // stats, legend and filters above stay at the normal content
                // width. Relies on the sitewide `overflow-x: hidden` on <html>
                // (already in place for that same technique) to prevent this
                // from introducing horizontal scroll.
                <div className="relative left-1/2 -ml-[50vw] -mr-[50vw] w-screen">
                  <TravelMap
                    places={filtered}
                    lifeLocations={lifeLocations}
                    autoFit={continent !== 'All' || country !== 'All'}
                  />
                </div>
              )
            ) : (
              <ListView places={filtered} />
            )}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
