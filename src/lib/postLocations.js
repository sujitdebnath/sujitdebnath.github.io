import GithubSlugger from 'github-slugger'
import { visit } from 'unist-util-visit'

const LOCATION_LINE = /<div\s+class=(["'])location\1\s*>([^<]*)<\/div>/

// Walks raw Markdown (skipping fenced code blocks) collecting
// `<div class="location">Name</div>` markers in document order — same
// approach as postHeadings.js's extractHeadings, so the jump-nav pill
// hrefs and the ids stamped by rehypeLocationIds always agree.
export function extractLocations(markdown) {
  const slugger = new GithubSlugger()
  const locations = []
  let fence = null

  for (const line of markdown.split('\n')) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/)
    if (fenceMatch) {
      const marker = fenceMatch[1]
      if (!fence) {
        fence = marker
      } else if (marker[0] === fence[0] && marker.length >= fence.length) {
        fence = null
      }
      continue
    }
    if (fence) continue

    const match = line.match(LOCATION_LINE)
    if (match) {
      const text = match[2].trim()
      locations.push({ text, slug: slugger.slug(text) })
    }
  }

  return locations
}

// rehype plugin: stamps the precomputed slug (from extractLocations,
// same ordered list the jump nav uses) onto each raw <div
// class="location"> element's id. Runs after rehypeRaw, since raw HTML
// blocks are opaque text in mdast and only become real hast element
// nodes once rehypeRaw has parsed them — remarkHeadingIds's approach
// (a remark plugin) can't reach these, so this is the rehype-side
// equivalent of that same precompute-then-stamp pattern.
export function rehypeLocationIds(locations) {
  return (tree) => {
    let index = 0
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'div') return
      const classes = node.properties?.className
      if (!Array.isArray(classes) || !classes.includes('location')) return
      const location = locations[index]
      index += 1
      if (!location) return
      node.properties.id = location.slug
    })
  }
}
