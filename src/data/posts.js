// gray-matter calls Node's Buffer.from() internally even for string input;
// this shim makes that work in the browser.
import { Buffer } from 'buffer'
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer
}

import matter from 'gray-matter'

// Every post lives as one Markdown file in src/content/posts/ — see the
// README there for the authoring guide. The filename becomes the slug.
const modules = import.meta.glob('/src/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

function toDateString(value) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : String(value)
}

export const blogPosts = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, content } = matter(raw)
    const slug = slugFromPath(path)

    if (import.meta.env.DEV && !data.category) {
      console.warn(`[posts] "${slug}" is missing a required "category" field.`)
    }

    return {
      slug,
      title: data.title,
      subtitle: data.subtitle,
      date: toDateString(data.date),
      category: data.category,
      subcategories: data.subcategories || [],
      tags: data.tags || [],
      readTime: data.readTime,
      cover: data.cover,
      featured: Boolean(data.featured),
      preview: data.preview,
      type: data.type || 'standard',
      status: data.status === 'draft' ? 'draft' : 'published',
      gallery: (data.gallery || []).map((photo) => ({
        src: photo.src,
        caption: photo.caption,
        size: ['large', 'tall', 'wide'].includes(photo.size) ? photo.size : 'normal',
      })),
      mediaType: data.mediaType,
      subjectTitle: data.subjectTitle,
      subjectCreator: data.subjectCreator,
      subjectYear: data.subjectYear,
      rating: data.rating,
      body: content.trim(),
    }
  })
  // Draft posts stay visible in dev (npm run dev) so they can be previewed,
  // but a production build is the publish step for a static site — they
  // must never ship in that output.
  .filter((post) => !(import.meta.env.PROD && post.status === 'draft'))
