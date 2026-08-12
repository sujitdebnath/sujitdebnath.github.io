// Structured pins for the Travel Log map/list — plain data, not markdown,
// since these are coordinates and short labels rather than long-form posts.
//
// Every entry needs: id, city, country, continent (must match a key in
// src/data/continents.js so the marker gets a color), lat, lng, summary.
// `metro` and `state` are optional, for places that need more than city+
// country to place them (a smaller town near a bigger, more recognizable
// city, within a specific state/province) — see `formatPlaceName` in
// lib/travel.js, the one shared function every display spot uses to render
// city/metro/state/country consistently.
//
// `placeType` is optional, `"city" | "landmark"`, defaulting to "city" when
// omitted — no migration needed for existing entries. "landmark" loosely
// covers anything non-city (lake, park, mountain, etc.); the `city` field
// still holds whatever the place is called (e.g. a lake's name) even when
// placeType is "landmark" — formatPlaceName() treats it as a free-form
// label either way. Only drives a small neutral "LANDMARK" tag next to the
// continent tag today (list row + map popup) — no marker icon/shape change
// yet, that's a deferred follow-up once there are more non-city entries to
// design against.
//
// `visitDates` and `posts` are two separate, independent lists:
//   • visitDates — just *when* you went, as 'YYYY-MM' strings. No note, no
//     blog link, no per-visit metadata of any kind.
//   • posts — everything you've written about the place. Flat and fully
//     decoupled from the dates: whether a post covers one trip, blends
//     several, or belongs to a series, it's just another entry here.
// Both are optional — a place can have visits with no posts written yet, or
// (less likely, but the page handles it) posts with no recorded dates.
//
// Placeholder content for now, same as the blog started as test posts; real
// entries replace these in place. `blogSlug` values that don't resolve to a
// real post yet will simply land on the 404 page.
export const travelLog = [
  {
    id: "pottenstein",
    city: "Pottenstein",
    state: "Bavaria",
    country: "Germany",
    continent: "Europe",
    lat: 49.77362406714183,
    lng: 11.407666742584398,
    summary: "CheckMyBus Team Event - Devil & Downhill.",
    visitDates: ["2026-07"],
    // posts: [
    //   { blogSlug: "nurnberg-two-years-later", label: "Two Years in Nürnberg" },
    // ],
  },
  {
    id: "grosser-brombachsee",
    city: "Großer Brombachsee",
    state: "Bavaria",
    country: "Germany",
    continent: "Europe",
    lat: 49.13069855831631,
    lng: 10.928715685854275,
    placeType: "landmark",
    summary:
      "Relaxing lake swimming with friends for a quick escape from daily life's stress.",
    visitDates: ["2025-07"],
  },
  {
    id: "paris",
    city: "Paris",
    country: "France",
    continent: "Europe",
    lat: 48.85753271284367,
    lng: 2.351309057605361,
    summary: "Where it all started — moved here for the Master's.", // need to edit?
    visitDates: ["2022-07", "2023-03", "2024-01"], // need to edit?
    posts: [
      // need to edit?
      { blogSlug: "nurnberg-two-years-later", label: "Two Years in Nürnberg" },
      { blogSlug: "nurnberg-part-1", label: "Part 1: Arriving" },
      { blogSlug: "nurnberg-part-2", label: "Part 2: Settling In" },
    ],
  },
  {
    id: "lyon",
    city: "Lyon",
    country: "France",
    continent: "Europe",
    lat: 45.76399919308243,
    lng: 4.835588436436462,
    summary: "Where it all started — moved here for the Master's.", // need to edit?
    visitDates: ["2022-07", "2023-03", "2024-01"], // need to edit?
    posts: [
      // need to edit?
      { blogSlug: "nurnberg-two-years-later", label: "Two Years in Nürnberg" },
    ],
  },
  {
    id: "berlin",
    city: "Berlin",
    state: "Berlin",
    country: "Germany",
    continent: "Europe",
    lat: 52.51999118187585,
    lng: 13.404934779509023,
    summary: "Weekend trains south, mostly for the parks and the beer gardens.", // need to edit?
    visitDates: ["2022-09", "2024-05"], // need to edit?
  },
  {
    id: "frankfurt",
    city: "Frankfurt am Main",
    state: "Hessen",
    country: "Germany",
    continent: "Europe",
    lat: 50.11101451820795,
    lng: 8.681978559872707,
    summary: "Weekend trains south, mostly for the parks and the beer gardens.", // need to edit?
    visitDates: ["2022-09", "2024-05"], // need to edit?
  },
  {
    id: "wurzburg",
    city: "Würzburg",
    state: "Bavaria",
    country: "Germany",
    continent: "Europe",
    lat: 49.79130587500151,
    lng: 9.95331978526723,
    summary: "Weekend trains south, mostly for the parks and the beer gardens.", // need to edit?
    visitDates: ["2022-09", "2024-05"], // need to edit?
  },
  {
    id: "ingolstadt",
    city: "Ingolstadt",
    state: "Bavaria",
    country: "Germany",
    continent: "Europe",
    lat: 48.76676662567116,
    lng: 11.422554102631903,
    summary: "Weekend trains south, mostly for the parks and the beer gardens.", // need to edit?
    visitDates: ["2022-09", "2024-05"], // need to edit?
  },
  {
    id: "munich",
    city: "Munich",
    state: "Bavaria",
    country: "Germany",
    continent: "Europe",
    lat: 48.13500802715915,
    lng: 11.58181481814574,
    summary: "Weekend trains south, mostly for the parks and the beer gardens.", // need to edit?
    visitDates: ["2022-09", "2024-05"], // need to edit?
  },
  {
    id: "bayreuth",
    city: "Bayreuth",
    state: "Bavaria",
    country: "Germany",
    continent: "Europe",
    lat: 49.9456415351861,
    lng: 11.57128671428343,
    summary: "Weekend trains south, mostly for the parks and the beer gardens.", // need to edit?
    visitDates: ["2022-02", "2024-05"], // need to edit?
  },
  {
    id: "nurnberg",
    city: "Nürnberg",
    state: "Bavaria",
    country: "Germany",
    continent: "Europe",
    lat: 49.44646075170148,
    lng: 11.08181802597374,
    summary: "Weekend trains south, mostly for the parks and the beer gardens.", // need to edit?
    visitDates: ["2022-09", "2024-05"], // need to edit?
  },
  {
    id: "bamberg",
    city: "Bamberg",
    state: "Bavaria",
    country: "Germany",
    continent: "Europe",
    lat: 49.89866900216591,
    lng: 10.902689162643297,
    summary: "Weekend trains south, mostly for the parks and the beer gardens.", // need to edit?
    visitDates: ["2022-02", "2024-05"], // need to edit?
  },
  {
    id: "furth",
    city: "Fürth",
    state: "Bavaria",
    country: "Germany",
    continent: "Europe",
    lat: 49.4770806246597,
    lng: 10.988640251068567,
    summary: "Weekend trains south, mostly for the parks and the beer gardens.", // need to edit?
    visitDates: ["2022-02", "2024-05"], // need to edit?
  },
  {
    id: "erlangen",
    city: "Erlangen",
    state: "Bavaria",
    country: "Germany",
    continent: "Europe",
    lat: 49.58961656865606,
    lng: 11.011782512685366,
    summary: "Weekend trains south, mostly for the parks and the beer gardens.", // need to edit?
    visitDates: ["2022-02", "2024-05"], // need to edit?
  },
  {
    id: "dresden",
    city: "Dresden",
    state: "Saxony",
    country: "Germany",
    continent: "Europe",
    lat: 51.05009055544899,
    lng: 13.737311752439878,
    summary: "Weekend trains south, mostly for the parks and the beer gardens.", // need to edit?
    visitDates: ["2022-02", "2024-05"], // need to edit?
  },
  {
    id: "barasat",
    city: "Barasat",
    state: "West Bengal",
    country: "India",
    continent: "Asia",
    lat: 22.725477114539217,
    lng: 88.47897827951101,
    summary: "Close enough to home to feel familiar, far enough to feel new.", // need to edit?
    visitDates: ["2002-02", "2004-02"], // need to edit?
  },
];

// The two special, non-"visit" locations. These are life-anchors rather than
// trips, so they deliberately live outside the `travelLog` array: they get
// their own accent-colored markers, their own list rows, and they count
// toward the country/continent stats without adding a "visit".
export const lifeLocations = {
  home: {
    city: "Dhaka",
    state: "Dhaka Division",
    country: "Bangladesh",
    continent: "Asia",
    lat: 23.767757301989782,
    lng: 90.42306404126445,
    note: "Born and raised here — spent my whole childhood in this city.",
  },
  current: {
    city: "Nürnberg",
    state: "Bavaria",
    country: "Germany",
    continent: "Europe",
    lat: 49.44646075170148,
    lng: 11.08181802597374,
    since: "2023-03",
    note: "Currently living here while completing my Master's degree.",
  },
};
