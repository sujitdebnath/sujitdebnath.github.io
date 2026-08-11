// Muted, earth-toned marker color per continent for the Travel Log map.
// Deliberately desaturated so the pins sit inside the site's restrained
// ink/paper/marker palette and read calmly on both CARTO tile sets (Positron
// in light mode, Dark Matter in dark) instead of shouting over them.
//
// Lives here rather than only in tailwind.config.js because Leaflet DivIcons
// are built as raw markup and need the literal hex at runtime — the Tailwind
// theme imports this same object, so the two can't drift.
export const continentColors = {
  Europe: '#6B8CAE', // dusty blue
  Asia: '#C1694F', // terracotta
  'North America': '#7A8B6F', // sage
  'South America': '#D98E3F', // ochre
  Africa: '#B15E5E', // clay rose
  Australia: '#5B9E96', // soft teal — covers the Australia/Pacific region
  Antarctica: '#8B8E90', // cool gray (matches the existing ink-faint token)
}

// Fallback keeps an unknown/mistyped continent from rendering an invisible pin.
export const FALLBACK_CONTINENT_COLOR = continentColors.Antarctica

export function continentColor(continent) {
  return continentColors[continent] || FALLBACK_CONTINENT_COLOR
}
