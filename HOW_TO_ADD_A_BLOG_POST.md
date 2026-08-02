# Adding a new blog post

No code changes needed — just add a Markdown file here and run `npm run dev`
to see it.

## 1. Create the file

Add a new `.md` file in this folder. **The filename becomes the URL slug**,
so use lowercase, hyphens instead of spaces, no special characters:

```
my-new-post.md   →   /blog/my-new-post
```

## 2. Fill in the frontmatter

Paste this at the very top of the file and fill in each field:

```md
---
title: Your post's title
subtitle: A short one-line subtitle or tagline
date: 2026-01-01
categories: [Life, Story]
readTime: 5 min read
cover: /images/blog/my-new-post.jpg
featured: false
preview: A one-to-two sentence teaser shown in the post list and cards.
---
```

- **date** — `YYYY-MM-DD`. Posts are sorted newest-first automatically,
  nothing else to configure.
- **categories** — a list. Reuse existing category names (`Life`, `Story`,
  etc.) to keep the filter buttons on the blog page from sprawling, but a
  new category name works automatically too — it just shows up as a new
  filter option.
- **featured** — set to `true` to show this post in the Featured section on
  the blog page and in the home page's Latest Entries section (which shows
  the 3 most recent posts regardless of this flag). `false` (or omitted)
  means it only appears in the main post list.
- **cover** — path to the cover image, see below.
- **type** — `standard` (default, can be omitted), `distill`, `travel`, or
  `review`. See "Post types" below.
- **status** — `draft` while you're still writing, omitted (or
  `published`) once it's ready to go live. See "Drafts" below.

## 3. Add the cover image

Drop the image in `public/images/blog/` and point `cover` at it with an
absolute path, e.g. `/images/blog/my-new-post.jpg`.

## 4. Write the body

Everything after the closing `---` is normal Markdown:

```md
Paragraphs are just text with a blank line between them.

Like this second paragraph.

'Dialogue works fine too,' she said.

- Bullet lists
- work as you'd expect

A line with three dashes on its own renders as a scene-break divider:

---

New scene starts here.
```

For a forced line break within a paragraph (e.g. a short verse or a
signature), end the line with a backslash:

```md
Sincerely,\
Your name
```

Every post body also supports GitHub-Flavored Markdown (tables, ~~strikethrough~~,
task lists `- [ ]`/`- [x]`, and footnotes `[^1]`), inline/block math with
`$...$`/`$$...$$`, and syntax-highlighted fenced code blocks (` ```python `,
` ```js `, etc.) — no extra setup needed for any of these, in any post type.

### Inline image layout options

Plain Markdown image syntax still works exactly as shown above, and remains
the default look (modest content-column width, rounded corners):

```md
![A smaller inline photo](/images/blog/my-photo.jpg)
```

For a different layout, write a literal HTML `<img>` tag with a `class`
instead — Markdown's `![]()` shorthand has no slot for extra options, so
this is the way to opt into one of five variants (a plain `<img>` tag with
no `class` behaves identically to the Markdown shorthand above):

```md
<img src="/images/blog/eiffel-tower.jpg" alt="The tower at dusk" class="img-large" />
```

- **`img-large`** — breaks out wider than the text column (about 56rem,
  still centered) for a photo that deserves more visual weight than the
  default.
- **`img-full`** — full-bleed, edge to edge across the whole viewport width.
- **`img-tall`** — stays at the default column width but crops to a fixed
  portrait aspect ratio (3:4) — the standalone-image version of the
  gallery's `tall` tile.
- **`img-float-right`** / **`img-float-left`** — floats the image to one
  side at roughly 40–45% of the column width, with the following paragraph
  text wrapping around it on the other side. On mobile the image just
  stacks full-width above the text instead of floating (there isn't room to
  wrap text next to it on a narrow screen).

The default (no-class) image, `img-large`, `img-full`, and `img-tall` all
show the `alt` text as a small centered caption underneath (skip `alt` to
omit the caption). The floated variants never show a caption — it looks
odd interrupting a text wrap.

A floated image needs enough following paragraph text to actually wrap
around it. If you want the wrap to stop early, before it would naturally
clear on its own (e.g. at the next heading), drop in:

```md
<div class="clear-both"></div>
```

## 5. Post types

Set `type:` in the frontmatter to unlock extra chrome for a post. Omit it
(or set `type: standard`) for a plain post — that's everything covered
above, and remains the default.

### `type: distill`

For long-form/research-style posts. Adds:

- **Table of contents** — automatically built from the post's `##`/`###`
  headings, no configuration needed. Renders as a sticky sidebar on desktop
  and a collapsible "Contents" block on mobile.
- **Sidenotes** — wrap a margin note in `<aside>...</aside>` anywhere in the
  body. Floats into the right margin on desktop; collapses to an indented
  inline note on mobile/tablet.
- **Width-breakout layout classes** — wrap a `<div>` in one of these classes
  to make images/media wider than the text column:
  `l-body` (matches the text column width, the default), `l-body-outset`
  (a bit wider), `l-page` (wider still), `l-page-outset` (wider yet),
  `l-screen` (full viewport width, edge-to-edge), `l-screen-inset` (full
  width, padded in from the edge), `l-screen-inset-outset` (full width,
  less padding than `l-screen-inset`). All of these collapse to the normal
  text column width on mobile/tablet — there's no room to break out on a
  small screen.
- **Collapsible details boxes** — standard `<details><summary>Label</summary>
  ...</details>` HTML, styled to match the site (no extra syntax).
- **Citations + auto-bibliography** — add a fenced ` ```bibliography ` block
  (anywhere in the post; it won't render, it's just parsed as data)
  containing a JSON array of sources:

  ````md
  ```bibliography
  [
    { "id": "smith2020", "authors": "...", "title": "...", "venue": "...", "year": "...", "url": "..." }
  ]
  ```
  ````

  Then cite a source inline with `{{cite:smith2020}}` — it renders as a
  numbered, accent-colored marker (numbered by first appearance in the
  post) that links down to an auto-generated "References" list at the
  bottom of the post, with a hover tooltip showing the entry's
  authors/title/year. Cite the same `id` again anywhere else in the post
  and it reuses the same number.

### `type: travel`

Add a `gallery:` array to the frontmatter:

```md
gallery:
  - src: /images/blog/my-trip/01.jpg
    caption: Optional caption for this photo.
    size: large
  - src: /images/blog/my-trip/02.jpg
  - src: /images/blog/my-trip/03.jpg
```

`caption` is optional per photo. The gallery renders as a responsive grid
right after the cover image; clicking any photo opens a full-size lightbox
(click outside, the close button, or Esc to dismiss).

`size` is optional per photo and controls how much space its tile takes
in the grid:

- `normal` (default if omitted) — one grid cell.
- `large` — spans two columns and two rows.
- `tall` — spans one column and two rows, twice as tall as it is wide.
  Good for portrait-orientation photos: tall buildings, towers, standing
  portraits.

Mix and match freely — the grid backfills gaps around `large`/`tall`
tiles automatically, so there's no need to reorder photos to avoid empty
cells.

### `type: review`

For reviewing a book, movie, or other single subject. Add these
frontmatter fields:

```md
mediaType: book
subjectTitle: The book's title
subjectCreator: The book's author
subjectYear: 2019
rating: 4
```

- **`mediaType`** — required. Currently supported: `book` and `movie`.
  This controls how `subjectCreator` is labeled (see below). An
  unrecognized value still renders fine — it just falls back to showing
  `subjectCreator` plainly, same as `book`.
- **`subjectTitle`** — the book/movie/etc.'s title.
- **`subjectCreator`** — the author (books) or director (movies). Labeled
  differently depending on `mediaType`: books show it plainly, movies show
  "Directed by ...".
- **`subjectYear`** — optional. Publication/release year, shown next to
  the title, e.g. "The Quiet Hour (2019)". Useful for movies especially,
  but fine to include for books too.
- **`rating`** — a number out of 5 (half-point increments like `4.5`
  work), shown as filled/unfilled star icons in a metadata block near the
  top of the post.

Blockquotes (`>`) in a `review` post are also styled with more visual
presence (larger italic text, a left accent border) than the plain
blockquote style used in other posts — handy for pulling a quote straight
from the book, or a line of dialogue from the movie.

To support a new `mediaType` later (album, game, restaurant, ...), you
don't need a new post type — just add a case for it in `creatorLabel()`
in `src/components/blog/ReviewMeta.jsx` if it needs its own label wording
("Composed by...", "Developed by...", etc.); otherwise it'll fall back to
the plain label automatically.

## 6. Rich content blocks (any post type)

These aren't tied to `type: distill` — drop them into **any** post's body,
by fenced-code-block language tag. Each is lazy-loaded, so a post that
doesn't use a given block type never downloads its library.

- ` ```mermaid ` — flowcharts, sequence diagrams, Gantt charts, etc. via
  [Mermaid](https://mermaid.js.org/) syntax.
- ` ```chartjs ` — a Chart.js config object as JSON: `{ "type": "bar", "data": {...}, "options": {...} }`.
- ` ```echarts ` — an ECharts `option` object as JSON.
- ` ```vega_lite ` — a Vega or Vega-Lite spec as JSON (rendered via
  vega-embed, which auto-detects either schema).
- ` ```diff2html ` — a unified diff (e.g. `git diff` output), rendered as a
  readable file-by-file diff view.
- ` ```geojson ` — a GeoJSON `Feature`/`FeatureCollection`, rendered on an
  OpenStreetMap/Leaflet map zoomed to fit.
- ` ```typograms ` — ASCII-art-style box diagrams via
  [Typograms](https://github.com/google/typograms) syntax.
- ` ```plotly ` — an inline Plotly spec as JSON: `{ "data": [...], "layout": {...} }`.
- **Plotly static export** — if you'd rather generate a plot outside the
  browser (e.g. from a Python/Jupyter notebook with
  `fig.write_html(...)`), drop the exported `.html` file in
  `public/assets/plotly/` and embed it with a plain `<iframe src="/assets/plotly/your-file.html" height="400" width="100%"></iframe>` —
  no fenced block needed, iframes just work.
- **TikZ** — a raw `<script type="text/tikz">...</script>` block containing
  TikZ/LaTeX drawing commands, rendered client-side via TikZJax.

That's it — save the file, run `npm run dev`, and the post shows up in the
blog list, the Featured section (if `featured: true`), the home page's
Latest Entries, and at its own `/blog/<slug>` page.

## 7. Drafts

Add `status: draft` to the frontmatter while a post is still being
written:

```md
status: draft
```

With that set, the post is visible in `npm run dev` — full preview,
proofread it exactly as readers will eventually see it, including in the
post list and Featured section — but shows a small "Draft" badge next to
its date everywhere it appears, so it's never mistaken for a live post.
A production build (`npm run build`) leaves it out entirely: not in the
post list, not in Featured, not on the home page, and its `/blog/<slug>`
URL doesn't exist in that build.

When it's ready to go live, remove the `status` field (or set it to
`status: published`) and push. There's no separate "publish" button for
a static site like this one — committing and deploying the build *is*
the publish step.
