import GithubSlugger from 'github-slugger'
import { visit } from 'unist-util-visit'

// Walks raw Markdown (skipping fenced code blocks) collecting ##/### ATX
// headings in document order. Used to assign heading ids and to build the
// distill TOC from the exact same slug sequence, so anchors always match.
export function extractHeadings(markdown) {
  const slugger = new GithubSlugger()
  const headings = []
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

    const headingMatch = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/)
    if (headingMatch) {
      const depth = headingMatch[1].length
      const text = headingMatch[2].trim()
      headings.push({ depth, text, slug: slugger.slug(text) })
    }
  }

  return headings
}

// remark plugin: stamps the precomputed slug (from extractHeadings, same
// ordered list the TOC uses) onto each ##/### heading node's hProperties.id.
// Assigning ids this way — as a pure AST transform — rather than via a
// counter mutated during React's render avoids desync under React 18
// StrictMode, which deliberately double-invokes render for side-effect
// detection.
export function remarkHeadingIds(headings) {
  return (tree) => {
    let index = 0
    visit(tree, 'heading', (node) => {
      if (node.depth < 2 || node.depth > 3) return
      const heading = headings[index]
      index += 1
      if (!heading) return
      node.data = node.data || {}
      node.data.hProperties = { ...node.data.hProperties, id: heading.slug }
    })
  }
}
