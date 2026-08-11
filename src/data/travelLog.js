// Structured pins for the Travel Log map/list — plain data, not markdown,
// since these are coordinates and short labels rather than long-form posts.
//
// Every entry needs: id, city, country, continent (must match a key in
// src/data/continents.js so the marker gets a color), lat, lng, summary.
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
    id: 'nurnberg',
    city: 'Nürnberg',
    country: 'Germany',
    continent: 'Europe',
    lat: 49.4521,
    lng: 11.0767,
    summary: 'Where it all started — moved here for the Master\'s.',
    visitDates: ['2022-07', '2023-03', '2024-01'],
    posts: [
      { blogSlug: 'nurnberg-two-years-later', label: 'Two Years in Nürnberg' },
      { blogSlug: 'nurnberg-part-1', label: 'Part 1: Arriving' },
      { blogSlug: 'nurnberg-part-2', label: 'Part 2: Settling In' },
    ],
  },
  {
    id: 'munich',
    city: 'München',
    country: 'Germany',
    continent: 'Europe',
    lat: 48.1374,
    lng: 11.5755,
    summary: 'Weekend trains south, mostly for the parks and the beer gardens.',
    visitDates: ['2022-09', '2024-05'],
    posts: [{ blogSlug: 'test-travel-showcase', label: 'A Weekend in München' }],
  },
  {
    id: 'berlin',
    city: 'Berlin',
    country: 'Germany',
    continent: 'Europe',
    lat: 52.52,
    lng: 13.405,
    summary: 'Four days of museums and far too much walking.',
    visitDates: ['2023-10'],
  },
  {
    id: 'prague',
    city: 'Prague',
    country: 'Czech Republic',
    continent: 'Europe',
    lat: 50.0755,
    lng: 14.4378,
    summary: 'First trip out of Germany after landing — a night bus and no plan.',
    visitDates: ['2023-04'],
    posts: [{ blogSlug: 'prague-night-bus', label: 'The Night Bus to Prague' }],
  },
  {
    id: 'vienna',
    city: 'Vienna',
    country: 'Austria',
    continent: 'Europe',
    lat: 48.2082,
    lng: 16.3738,
    summary: 'Went for a conference, stayed for the coffee houses.',
    visitDates: ['2023-06', '2025-02'],
  },
  {
    id: 'venice',
    city: 'Venice',
    country: 'Italy',
    continent: 'Europe',
    lat: 45.4408,
    lng: 12.3155,
    summary: 'Wrote about it long before I got around to logging the dates.',
    posts: [{ blogSlug: 'venice-off-season', label: 'Venice, Off Season' }],
  },
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    continent: 'Asia',
    lat: 25.2048,
    lng: 55.2708,
    summary: 'A long layover that turned into two days of desert and glass.',
    visitDates: ['2022-06'],
    posts: [{ blogSlug: 'dubai-layover', label: 'The Layover That Wasn\'t' }],
  },
  {
    id: 'kolkata',
    city: 'Kolkata',
    country: 'India',
    continent: 'Asia',
    lat: 22.5726,
    lng: 88.3639,
    summary: 'Close enough to home to feel familiar, far enough to feel new.',
    visitDates: ['2019-12', '2021-02'],
  },
]

// The two special, non-"visit" locations. These are life-anchors rather than
// trips, so they deliberately live outside the `travelLog` array: they get
// their own accent-colored markers, their own list rows, and they count
// toward the country/continent stats without adding a "visit".
export const lifeLocations = {
  home: {
    city: 'Dhaka',
    country: 'Bangladesh',
    continent: 'Asia',
    lat: 23.8103,
    lng: 90.4125,
  },
  current: {
    city: 'Nürnberg',
    country: 'Germany',
    continent: 'Europe',
    lat: 49.4521,
    lng: 11.0767,
    since: '2021-10', // optional
  },
}
