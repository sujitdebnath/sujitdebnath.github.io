// Blanks out fenced code block bodies while preserving line structure, so
// line/regex-based scans (citation markers, heading extraction) don't pick
// up matches that are actually just documentation examples inside a fence.
export function stripFencedCode(markdown) {
  let fence = null
  return markdown
    .split('\n')
    .map((line) => {
      const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/)
      if (fenceMatch) {
        const marker = fenceMatch[1]
        if (!fence) {
          fence = marker
        } else if (marker[0] === fence[0] && marker.length >= fence.length) {
          fence = null
        }
        return ''
      }
      return fence ? '' : line
    })
    .join('\n')
}
