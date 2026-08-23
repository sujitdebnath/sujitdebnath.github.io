// Bounding boxes for reframing the Travel Log map when a filter is active.
// Stored as [west, south, east, north] so they diff directly against source.
//
// Countries: Natural Earth 110m admin 0, primary landmass only (outlying
// territories excluded), via github.com/sandstrom/country-bounding-boxes
// (public domain). Keyed by the `country` strings used in travelLog.js; a
// country with no entry here falls back to a marker-bounds fit.
export const countryBounds = {
  Bangladesh: [88.08, 20.67, 92.67, 26.45],
  France: [-5.0, 42.5, 9.56, 51.15],
  Germany: [5.99, 47.3, 15.02, 54.98],
  India: [68.18, 7.97, 97.4, 35.49],
}

// Continents have no equivalent source dataset, and their true extents frame
// badly (Europe's reaches the Azores, Svalbard and the Urals). These are the
// mainland each continent is normally drawn as.
export const continentBounds = {
  Europe: [-11, 34, 40, 71],
  Asia: [26, -11, 146, 60],
  Africa: [-18, -35, 52, 38],
  'North America': [-168, 7, -52, 72],
  'South America': [-82, -56, -34, 13],
  Australia: [112, -48, 179, -8],
  Antarctica: [-180, -90, 180, -60],
}

function toLeafletBounds([west, south, east, north]) {
  return [
    [south, west],
    [north, east],
  ]
}

// Country wins over continent when both are set — it's the more specific.
export function regionBounds(continent, country) {
  const box =
    (country !== 'All' && countryBounds[country]) ||
    (continent !== 'All' && continentBounds[continent]) ||
    null

  return box ? toLeafletBounds(box) : null
}
