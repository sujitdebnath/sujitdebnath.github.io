// Renders plain text with a handful of inline links/italics spliced in,
// without pulling in a markdown parser. `rules` is a list of
// `{ phrase, href?, italic? }` — whichever rule's phrase occurs earliest
// in the remaining text wins, so order in `rules` doesn't matter.
export function renderRich(text, rules = []) {
  if (!rules.length) return text

  const nodes = []
  let remaining = text
  let key = 0

  while (remaining) {
    let bestIndex = -1
    let bestRule = null
    for (const rule of rules) {
      const index = remaining.indexOf(rule.phrase)
      if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
        bestIndex = index
        bestRule = rule
      }
    }

    if (!bestRule) {
      nodes.push(remaining)
      break
    }

    if (bestIndex > 0) nodes.push(remaining.slice(0, bestIndex))

    const content = bestRule.italic ? <em key={key++}>{bestRule.phrase}</em> : bestRule.phrase
    nodes.push(
      bestRule.href ? (
        <a
          key={key++}
          href={bestRule.href}
          target="_blank"
          rel="noreferrer"
          className="mark-line text-ink dark:text-parchment"
        >
          {content}
        </a>
      ) : (
        <span key={key++}>{content}</span>
      )
    )

    remaining = remaining.slice(bestIndex + bestRule.phrase.length)
  }

  return nodes
}
