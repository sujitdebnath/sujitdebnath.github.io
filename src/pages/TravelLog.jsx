import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Home, List, Map as MapIcon, Navigation } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import Dropdown from '../components/blog/Dropdown.jsx'
import TravelMap from '../components/travel/TravelMap.jsx'
import { travelLog, lifeLocations } from '../data/travelLog.js'
import { continentColor } from '../data/continents.js'
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

function PostLinks({ posts }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {posts.map((post) => (
        <li key={post.blogSlug}>
          <Link
            to={`/blog/${post.blogSlug}`}
            className="group mark-line inline-flex items-center gap-1.5 font-mono text-[12px] text-ink dark:text-parchment"
          >
            <span aria-hidden="true" className="text-ink-faint dark:text-parchment-faint">
              →
            </span>
            {post.label}
            <ArrowUpRight
              size={11}
              strokeWidth={1.75}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-marker"
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}

// The two life locations, pinned above the chronological list and given the
// same accent treatment as their map markers so they read as "about the
// traveler" rather than as another trip.
function LifeRow({ icon: Icon, heading, location, since }) {
  return (
    <div className="flex items-start gap-3 py-4">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-marker text-marker-ink">
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
              {' '}
              · since {formatMonthYear(since)}
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
        <LifeRow icon={Home} heading="Home" location={lifeLocations.home} />
        <LifeRow
          icon={Navigation}
          heading="Currently living"
          location={lifeLocations.current}
          since={lifeLocations.current.since}
        />
      </div>

      {sorted.length === 0 ? (
        <p className="mt-10 text-sm text-ink-muted dark:text-parchment-muted">
          No places match these filters yet.
        </p>
      ) : (
        <ol className="mt-6 divide-y hairline border-t hairline">
          {sorted.map((place, i) => (
            <Reveal as="li" key={place.id} delay={Math.min(i * 0.04, 0.3)}>
              <div className="py-8">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint dark:text-parchment-faint">
                    {place.visitDates?.length
                      ? `Visited ${formatVisitDates(place.visitDates)}`
                      : 'No visit dates recorded'}
                  </p>
                  <ContinentTag continent={place.continent} />
                </div>
                <h2 className="mt-3 font-display text-2xl text-ink dark:text-parchment">
                  {place.city}
                  <span className="text-ink-muted dark:text-parchment-muted">
                    , {place.country}
                  </span>
                </h2>
                {place.summary && (
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted dark:text-parchment-muted">
                    {place.summary}
                  </p>
                )}
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

          <div className="mt-6">
            {view === 'map' ? (
              filtered.length === 0 ? (
                <p className="text-sm text-ink-muted dark:text-parchment-muted">
                  No places match these filters yet.
                </p>
              ) : (
                <TravelMap places={filtered} lifeLocations={lifeLocations} />
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
