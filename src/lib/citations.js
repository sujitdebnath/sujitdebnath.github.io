import { visit } from 'unist-util-visit'
import { stripFencedCode } from './stripFences.js'

const BIBLIOGRAPHY_FENCE = /```bibliography\s*\n([\s\S]*?)```/
const CITE_PATTERN = /\{\{cite:([\w-]+)\}\}/g

// Parses the post's ```bibliography fenced block (a JSON array of
// { id, authors, title, venue, year, url }) into id -> entry.
export function extractBibliography(markdown) {
  const match = markdown.match(BIBLIOGRAPHY_FENCE)
  if (!match) return new Map()
  try {
    const entries = JSON.parse(match[1])
    return new Map(entries.map((entry) => [entry.id, entry]))
  } catch {
    return new Map()
  }
}

// Assigns citation numbers by first-appearance order of {{cite:id}} in the
// (fence-stripped) body, matching standard numbered-citation convention.
export function extractCitationOrder(markdown) {
  const order = new Map()
  const stripped = stripFencedCode(markdown)
  let match
  CITE_PATTERN.lastIndex = 0
  while ((match = CITE_PATTERN.exec(stripped))) {
    const id = match[1]
    if (!order.has(id)) order.set(id, order.size + 1)
  }
  return order
}

// remark plugin: rewrites {{cite:id}} text into a <citation-ref id number>
// hast element (via mdast data.hName/hProperties) so it renders through
// react-markdown's normal component map.
export function remarkCitations(citationOrder) {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return undefined

      const value = node.value
      CITE_PATTERN.lastIndex = 0
      if (!CITE_PATTERN.test(value)) return undefined

      const pieces = []
      let lastIndex = 0
      let match
      CITE_PATTERN.lastIndex = 0
      while ((match = CITE_PATTERN.exec(value))) {
        if (match.index > lastIndex) {
          pieces.push({ type: 'text', value: value.slice(lastIndex, match.index) })
        }
        const id = match[1]
        pieces.push({
          type: 'citationRef',
          data: { hName: 'citation-ref', hProperties: { id, number: citationOrder.get(id) || 0 } },
        })
        lastIndex = match.index + match[0].length
      }
      if (lastIndex < value.length) {
        pieces.push({ type: 'text', value: value.slice(lastIndex) })
      }

      parent.children.splice(index, 1, ...pieces)
      return index + pieces.length
    })
  }
}
