---
title: Round 11 test post — travel showcase
subtitle: Throwaway post exercising the travel post type's photo gallery
date: 2026-08-01
category: Technology
tags: [test]
readTime: 1 min read
cover: /images/blog/cheleta/cover.png
featured: false
# status: draft
preview: Internal test post for round 11's travel post type. Safe to delete once verified.
type: travel
gallery:
  - src: /images/blog/cheleta/cover.png
    caption: Placeholder photo 1 (reused cover art) — click to open the lightbox.
  - src: /images/blog/epitaph/cover.png
    caption: Placeholder photo 2 — Esc or click outside to close.
    size: large
  - src: /images/blog/khola-chithi-tonmoy/cover.png
  - src: /images/blog/cheleta/cover.png
    caption: Fourth tile, no caption on the previous one to check that case too.
  - src: /images/blog/epitaph/cover.png
    caption: Fifth tile, to check arrow-key/on-screen prev-next wraparound.
  - src: /images/blog/khola-chithi-tonmoy/cover.png
    caption: Round 39 — a wide tile, two columns by one row.
    size: wide
  - src: /images/blog/epitaph/cover.png
    caption: Fifth tile, to check arrow-key/on-screen prev-next wraparound.
  - src: /images/blog/test/eiffel-tower-2.jpg
    size: tall
  - src: /images/blog/cheleta/cover.png
  - src: /images/blog/test/eiffel-tower-1.jpg
    caption: Round 39 — a wide tile, two columns by one row.
    size: wide
---

This is a throwaway test post for the `travel` post type added in round 11. The
gallery above uses the site's existing blog cover images as stand-ins — a real
travel post would use actual trip photos instead.

Regular Markdown body content still works exactly as before below the gallery.

Here's a smaller inline image written as standard Markdown, separate from the
gallery grid — it should render at modest content-column width with rounded
corners, no click-to-enlarge behavior:

<img src="/images/blog/epitaph/cover.png" alt="A smaller inline photo" />

Round 22 adds five layout variants for standalone inline images, written as
raw HTML `<img>` tags with a `class`. First, `img-large` — wider than the
text column, still centered, with a captioned line underneath from its
`alt` text:

<img src="/images/blog/test/eiffel-tower-1.jpg" alt="img-large — breaks out wider than the text column" class="img-large" />

Next, `img-full` — full-bleed, edge to edge across the viewport:

<img src="/images/blog/cheleta/cover.png" alt="img-full — edge-to-edge full-bleed" class="img-full" />

`img-tall` — stays at column width but crops to a fixed portrait 3:4 ratio:

<img src="/images/blog/test/eiffel-tower-2.jpg" alt="img-tall — fixed 3:4 portrait crop" class="img-tall" />

Round 22 also adds two floated variants. The image has to come first in the
source, with the wrapping paragraph right after it — a float only pulls
_later_ normal-flow content around itself, not text that already came
before it.

<div class="clear-both"></div>

<img src="/images/blog/khola-chithi-tonmoy/cover.png" alt="" class="img-float-right" />

Here's `img-float-right` in action, with this paragraph's text wrapping
around its left side. This sentence exists purely to give the float enough
text to wrap against, so the wrap behavior is actually visible instead of
the image just sitting alone above a short paragraph that clears
immediately underneath it. A few more words here to make sure there's
enough height in this paragraph for the wrap to actually be visible before
the image's bottom edge is reached.

<div class="clear-both"></div>

<img src="/images/blog/epitaph/cover.png" alt="" class="img-float-left" />

And `img-float-left`, wrapping on its right side instead — again with
enough trailing text in this paragraph to actually demonstrate the wrap,
rather than clearing right away like a shorter paragraph would. A little
extra text here too, for the same reason as the paragraph above. A few more words here to make sure there's enough height in this paragraph for the wrap to actually be visible before
the image's bottom edge is reached.

<div class="clear-both"></div>

Back to regular text after the inline image.

## Round 39 — multi-location trip

Everything below tests the new multi-location structure: a jump nav should
appear right above the first `Nürnberg` heading (there are 3 stops, well
above the 2-marker minimum), each stop has its own photo group underneath
it, and clicking any photo in a group should only cycle through that
group's own photos.

<div class="location">Nürnberg, Germany</div>

First stop. This location section has a photo group with three `img-tall`
photos, and should have a large top margin above its heading to clearly
separate it from the floated-image content above.

<div class="photo-group">
<img src="/images/blog/test/eiffel-tower-1.jpg" alt="Nürnberg photo 1" class="img-tall" />
<img src="/images/blog/test/eiffel-tower-2.jpg" alt="Nürnberg photo 2" class="img-tall" />
<img src="/images/blog/cheleta/cover.png" alt="Nürnberg photo 3" class="img-tall" />
<img src="/images/blog/cheleta/cover.png" alt="Nürnberg photo 4" class="img-tall" />
</div>

<div class="location">Paris, France</div>

Second stop, mixing tile sizes in one group: a `img-large` tile plus a
`img-wide` tile plus a plain tile, to check they all backfill correctly
together.

<div class="photo-group">
<img src="/images/blog/epitaph/cover.png" alt="Paris photo 1 — large tile" class="img-large" />
<img src="/images/blog/khola-chithi-tonmoy/cover.png" alt="Paris photo 2 — wide tile" class="img-wide" />
<img src="/images/blog/test/eiffel-tower-1.jpg" alt="Paris photo 3 — plain tile" />
<img src="/images/blog/test/eiffel-tower-1.jpg" alt="Paris photo 4 — plain tile" />
</div>

<div class="location">Berlin, Germany</div>

Third stop — text only, no photos, to check that a location section
doesn't require a photo group.

## Round 39 — standalone photo group (non-travel context)

This section checks that `photo-group` also works outside a location
section, as plain inline content in the middle of the post body:

<div class="photo-group">
<img src="/images/blog/cheleta/cover.png" alt="Standalone group photo 1" class="img-tall" />
<img src="/images/blog/epitaph/cover.png" alt="Standalone group photo 2" class="img-tall" />
<img src="/images/blog/khola-chithi-tonmoy/cover.png" alt="Paris photo 2 — wide tile" class="img-wide" />
<img src="/images/blog/khola-chithi-tonmoy/cover.png" alt="Paris photo 3 — wide tile" class="img-wide" />
</div>

Back to regular text after the standalone photo group — only 2 photos in
that group, laid out on a fixed 4-column grid same as every other group
(round 40 fix: column count is no longer reduced based on photo count,
so this just leaves 2 cells empty on the row instead of shrinking to 2
columns).

<div class="location">Lyon, France</div>

Six-image group — mixed sizes, already correct before the round 40 fix
since it always had 4+ images (only smaller groups were reducing their
column count).

<div class="photo-group">
<img src="/images/blog/epitaph/cover.png" alt="Lyon photo 1 — large tile" class="img-large" />
<img src="/images/blog/khola-chithi-tonmoy/cover.png" alt="Lyon photo 2 — tall tile" class="img-tall" />
<img src="/images/blog/khola-chithi-tonmoy/cover.png" alt="Lyon photo 3 — tall tile" class="img-tall" />
<img src="/images/blog/khola-chithi-tonmoy/cover.png" alt="Lyon photo 4 — plain tile" />
<img src="/images/blog/khola-chithi-tonmoy/cover.png" alt="Lyon photo 5 — plain tile" />
<img src="/images/blog/khola-chithi-tonmoy/cover.png" alt="Lyon photo 6 — wide tile" class="img-wide" />
</div>

## Round 40 — photo-group column count bug

Three more group sizes to confirm the fixed-4-column fix packs
correctly at every count, not just 2 and 6.

Three images, `large` + `tall` + `tall` — this was the exact bug repro:
with the old count-based 3-column grid, the `large` tile filled 2 of the
3 columns on row 1, leaving only 1 free column, so the two `tall` tiles
couldn't sit side by side and the second one dropped to its own row.
With a fixed 4 columns, both `tall` tiles should now sit next to each
other on row 1, to the right of the `large` tile.

<div class="photo-group">
<img src="/images/blog/test/eiffel-tower-1.jpg" alt="Round 40 photo 1 — large tile" class="img-large" />
<img src="/images/blog/test/eiffel-tower-2.jpg" alt="Round 40 photo 2 — tall tile" class="img-tall" />
<img src="/images/blog/cheleta/cover.png" alt="Round 40 photo 3 — tall tile" class="img-tall" />
</div>

Four images, all plain tiles:

<div class="photo-group">
<img src="/images/blog/epitaph/cover.png" alt="Round 40 five-image group, photo 1" />
<img src="/images/blog/khola-chithi-tonmoy/cover.png" alt="Round 40 five-image group, photo 2" />
<img src="/images/blog/test/eiffel-tower-1.jpg" alt="Round 40 five-image group, photo 3" />
<img src="/images/blog/test/eiffel-tower-2.jpg" alt="Round 40 five-image group, photo 4" />
</div>

Another combo:

<div class="photo-group">
<img src="/images/blog/test/eiffel-tower-1.jpg" alt="Round 40 photo 1 — large tile" />
<img src="/images/blog/test/eiffel-tower-1.jpg" alt="Round 40 photo 1 — large tile" />
<img src="/images/blog/test/eiffel-tower-2.jpg" alt="Round 40 photo 2 — tall tile" class="img-tall" />
<img src="/images/blog/cheleta/cover.png" alt="Round 40 photo 3 — tall tile" class="img-tall" />
<img src="/images/blog/khola-chithi-tonmoy/cover.png" alt="Round 40 photo 3 — tall tile" class="img-wide" />
</div>
