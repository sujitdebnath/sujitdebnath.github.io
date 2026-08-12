// Shared derivations for the Travel Log page — kept out of the components so
// the map, the list view and the stats bar all read the data the same way.

// 'YYYY-MM' → 'July 2022'
export function formatMonthYear(value) {
  const [year, month] = String(value).split('-').map(Number)
  if (!year || !month) return String(value)
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}

export function formatVisitDates(visitDates = []) {
  return visitDates.map(formatMonthYear).join(', ')
}

// The one place-name string every display spot (map popups, marker titles,
// list rows) builds from — so a place with just city+country still reads as
// simple as before, while one that also needs a metro/state for context (a
// smaller town near a bigger recognizable city, in a specific state/province)
// gets it consistently everywhere at once.
export function formatPlaceName(place) {
  return [place.city, place.metro, place.state, place.country].filter(Boolean).join(', ')
}

// Sort key for a place: its most recent visit, as a 'YYYY-MM' string so it
// compares lexically. Places with no recorded dates get '' — below any real
// date string — so they fall to the bottom rather than corrupting the sort:
// a bare 0 here would compare against a date string as NaN (JS coerces the
// string operand of `<` to a number when the other side is a number), so
// undated places would land in an arbitrary spot instead of last.
export function latestVisitKey(place) {
  if (!place.visitDates?.length) return ''
  return place.visitDates.reduce((max, d) => (d > max ? d : max), '')
}

// Newest most-recent-visit first; undated places fall to the bottom, ordered
// by city name so the tail stays stable rather than depending on file order.
export function sortByRecency(places) {
  return [...places].sort((a, b) => {
    const aKey = latestVisitKey(a)
    const bKey = latestVisitKey(b)
    if (aKey === bKey) return a.city.localeCompare(b.city)
    return bKey < aKey ? -1 : 1
  })
}

// Countries and continents count the two life locations alongside the trips,
// deduplicated — home/current must not be counted twice when the same country
// or continent already appears in the travel log. Total visits deliberately
// stays scoped to actual trips, since it measures discrete journeys.
export function travelStats(places, lifeLocations) {
  const anchors = [lifeLocations?.home, lifeLocations?.current].filter(Boolean)
  const countries = new Set()
  const continents = new Set()

  for (const item of [...places, ...anchors]) {
    if (item.country) countries.add(item.country)
    if (item.continent) continents.add(item.continent)
  }

  return {
    places: places.length,
    countries: countries.size,
    continents: continents.size,
    visits: places.reduce((sum, p) => sum + (p.visitDates?.length || 0), 0),
  }
}
