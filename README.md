# Sujit Debnath — Portfolio

A minimal, single-page portfolio (About, Experience, Education, Research, Projects,
Contact) plus a Blog and a Bucket List page. Built with React, Tailwind CSS, React
Router, and Framer Motion. Light/dark theme, subtle scroll and hover animation.

## 1. Run it locally

You'll need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## 2. Edit your content

Almost everything text-related lives in one file:

```
src/data/content.js
```

That's your name, tagline, bio, experience, education, research, publications,
projects, bucket list items, and blog posts. Look for `TODO` comments — those
are placeholders carried over from your old site or invented as reasonable
stand-ins, and are worth a read-through before you publish.

**Add your photo:** drop a real photo at `public/images/profile.jpg` (or any
name/format you like) and update `profile.photo` in `content.js` to point to
it, e.g. `/images/profile.jpg`. Until then it shows a placeholder monogram.

**Add a project:** duplicate one of the commented-out objects in the
`projects` array in `content.js`. The section shows a friendly empty state
until you add at least one.

**Add a blog post:** add an object to the `blogPosts` array with a unique
`slug` (used in the URL, e.g. `/blog/my-slug`), a `title`, `date`
(`YYYY-MM-DD`), `excerpt`, and `body`. The three posts already there carry
over the real titles/dates from your old blog, with placeholder bodies —
paste in the full text when you're ready, or leave `externalHref` pointing
at the original post.

## 3. Colors, fonts, motion

- Design tokens (colors, fonts) are in `tailwind.config.js` under `theme.extend`.
- The accent color (`marker`) is the highlighter-yellow used for links, tags,
  and emphasis — change the single hex value there to re-theme the whole site.
- Fonts are loaded from Google Fonts in `index.html` (Fraunces, Inter,
  JetBrains Mono). Swap the `<link>` there and the `fontFamily` block in
  `tailwind.config.js` together if you want different typefaces.
- Animations respect `prefers-reduced-motion` automatically.

## 4. Deploy to GitHub Pages

This project is configured to **replace an existing root user page** —
served at `https://sujitdebnath.github.io/` from the repo named
`sujitdebnath.github.io`. `vite.config.js` (`base: '/'`) and
`public/404.html` (`pathSegmentsToKeep = 0`) are already set for this.

**Before you push, back up your old site.** `npm run deploy` will overwrite
the `gh-pages` branch (and switching the Pages source will replace what's
live). Easiest safety net: in your existing `sujitdebnath.github.io` repo,
create a branch from the current `main`/`master` — e.g. `git branch
old-al-folio-site` — before you touch anything, so the al-folio version is
never lost.

Steps:

1. **Point this project at your existing repo.** Either:
   - Clone `sujitdebnath.github.io` locally, delete its contents (except
     `.git`), and copy this project's files in, or
   - In this project's folder, run `git init`, then
     `git remote add origin https://github.com/sujitdebnath/sujitdebnath.github.io.git`.
2. Commit and push to `main` (or `master`, whichever the repo already uses):
   ```bash
   git add .
   git commit -m "Rebuild portfolio with React"
   git push origin main
   ```
3. Install dependencies and deploy:
   ```bash
   npm install
   npm run deploy
   ```
   This builds the site and pushes the compiled output to a `gh-pages`
   branch on that same repo.
4. In the repo's **Settings → Pages**, set the source branch to `gh-pages`
   (root folder). If Pages was previously serving from `main` via Jekyll,
   switching the source to `gh-pages` is what actually swaps the live site
   over — do this last, once you're happy with the build.
5. Give it a minute or two, then check `https://sujitdebnath.github.io/`.

One more thing specific to a user page: GitHub's Jekyll build step is what
was rendering your old al-folio site from `main`. Once Pages is set to serve
from `gh-pages` (a plain static build, no Jekyll), that Jekyll step is no
longer involved — you can leave the old Jekyll files on `main` untouched
(harmless) or clean them up later once you're confident the new site is
stable.

## 5. Project structure

```
src/
  data/content.js     ← all editable text content
  components/          ← shared UI (nav, footer, theme toggle, reveal/mark animation)
  sections/            ← the home page's sections (Hero, About, Experience, ...)
  pages/                ← routed pages (Home, Blog, BlogPost, BucketList, NotFound)
  hooks/useTheme.jsx   ← light/dark theme logic
public/
  images/               ← your photo goes here
  404.html              ← GitHub Pages SPA routing fallback (see deploy notes)
```
