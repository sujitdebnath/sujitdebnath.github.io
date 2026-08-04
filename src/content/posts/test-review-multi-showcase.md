---
title: Revisiting the Salt Road trilogy
subtitle: A round 39 test post — multi-subject reviews via repeatable review-item blocks
date: 2026-08-04
category: Technology
tags: [test]
readTime: 3 min read
cover: /images/blog/khola-chithi-tonmoy.png
featured: false
preview: Internal test/reference post for round 39's multi-subject review-item extension. Safe to delete once verified.
type: review
mediaType: movie
subjectTitle: The Salt Road Trilogy
subjectCreator: Marcus Voss
rating: 4
---

Marcus Voss's fictional three-film "Salt Road" cycle is used here purely
as a throwaway example for testing the `review-item` block — a repeatable
way to review several subjects in one post. The overall-verdict header
above (trilogy title, director, combined rating) comes from this post's
own frontmatter and is optional; a multi-item post can skip it entirely
and open straight into the first item below.

---

<div class="review-item" data-title="The Salt Road" data-creator="Marcus Voss" data-year="2016" data-rating="4" data-cover="/images/blog/eiffel-tower-1.jpg">

The one that started it. A slow, dust-caked road movie that trades plot
for atmosphere, and mostly gets away with it.

> "We don't cross the Salt Road. It crosses us."

A strong debut entry, let down slightly by a second act that wanders.

</div>

---

<div class="review-item" data-title="Salt Road: Ashfall" data-creator="Marcus Voss" data-year="2019" data-rating="4.5" data-cover="/images/blog/eiffel-tower-2.jpg">

The strongest of the three. Tighter script, the same washed-out
cinematography, and a much sharper sense of where the tension is
actually coming from.

<img src="/images/blog/eiffel-tower-2.jpg" alt="img-tall inline image inside a review-item, to confirm nested image variants still work here" class="img-tall" />

> "Ash doesn't ask where it lands."

</div>

---

<div class="review-item" data-title="Salt Road: The Last Crossing" data-creator="Marcus Voss" data-year="2022" data-rating="3.5" data-cover="/images/blog/epitaph.png">

A serviceable closer that ties off the trilogy's threads a little too
neatly. Still worth watching for the first two films' sake, just don't
expect the second entry's highs.

No `data-cover` was withheld here on purpose — this one has a cover, but
the field is optional in general if a subject's image isn't available.

</div>

That's all three — the compact headers, the `***`/`---` thematic-break
separators, and one nested `img-tall` image should all have rendered
correctly above.
