---
title: Round 11 test post — travel showcase
subtitle: Throwaway post exercising the travel post type's photo gallery
date: 2026-08-01
categories: [Test]
readTime: 1 min read
cover: /images/blog/cheleta.png
featured: false
preview: Internal test post for round 11's travel post type. Safe to delete once verified.
type: travel
gallery:
  - src: /images/blog/cheleta.png
    caption: Placeholder photo 1 (reused cover art) — click to open the lightbox.
  - src: /images/blog/epitaph.png
    caption: Placeholder photo 2 — Esc or click outside to close.
    size: large
  - src: /images/blog/khola-chithi-tonmoy.png
  - src: /images/blog/cheleta.png
    caption: Fourth tile, no caption on the previous one to check that case too.
  - src: /images/blog/epitaph.png
    caption: Fifth tile, to check arrow-key/on-screen prev-next wraparound.
  - src: /images/blog/khola-chithi-tonmoy.png
    caption: Sixth tile — a second large tile to check gap-filling around it.
    size: large
  - src: /images/blog/epitaph.png
    caption: Fifth tile, to check arrow-key/on-screen prev-next wraparound.
  - src: /images/blog/eiffel-tower-2.jpg
    size: tall
  - src: /images/blog/cheleta.png
---

This is a throwaway test post for the `travel` post type added in round 11. The
gallery above uses the site's existing blog cover images as stand-ins — a real
travel post would use actual trip photos instead.

Regular Markdown body content still works exactly as before below the gallery.

Here's a smaller inline image written as standard Markdown, separate from the
gallery grid — it should render at modest content-column width with rounded
corners, no click-to-enlarge behavior:

<img src="/images/blog/epitaph.png" alt="A smaller inline photo" />

Round 22 adds five layout variants for standalone inline images, written as
raw HTML `<img>` tags with a `class`. First, `img-large` — wider than the
text column, still centered, with a captioned line underneath from its
`alt` text:

<img src="/images/blog/eiffel-tower-1.jpg" alt="img-large — breaks out wider than the text column" class="img-large" />

Next, `img-full` — full-bleed, edge to edge across the viewport:

<img src="/images/blog/cheleta.png" alt="img-full — edge-to-edge full-bleed" class="img-full" />

`img-tall` — stays at column width but crops to a fixed portrait 3:4 ratio:

<img src="/images/blog/eiffel-tower-2.jpg" alt="img-tall — fixed 3:4 portrait crop" class="img-tall" />

Round 22 also adds two floated variants. The image has to come first in the
source, with the wrapping paragraph right after it — a float only pulls
_later_ normal-flow content around itself, not text that already came
before it.

<div class="clear-both"></div>

<img src="/images/blog/khola-chithi-tonmoy.png" alt="" class="img-float-right" />

Here's `img-float-right` in action, with this paragraph's text wrapping
around its left side. This sentence exists purely to give the float enough
text to wrap against, so the wrap behavior is actually visible instead of
the image just sitting alone above a short paragraph that clears
immediately underneath it. A few more words here to make sure there's
enough height in this paragraph for the wrap to actually be visible before
the image's bottom edge is reached.

<div class="clear-both"></div>

<img src="/images/blog/epitaph.png" alt="" class="img-float-left" />

And `img-float-left`, wrapping on its right side instead — again with
enough trailing text in this paragraph to actually demonstrate the wrap,
rather than clearing right away like a shorter paragraph would. A little
extra text here too, for the same reason as the paragraph above. A few more words here to make sure there's enough height in this paragraph for the wrap to actually be visible before
the image's bottom edge is reached.

<div class="clear-both"></div>

Back to regular text after the inline image.
