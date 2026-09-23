import { stripFencedCode } from './stripFences.js'

const WORDS_PER_MINUTE = 200
const EXTRA_MINUTES = 2

// Word count is a prose estimate: fenced code, HTML tags (raw <div>/<img>
// blocks), Markdown image syntax, math, and Markdown punctuation are all
// stripped so they don't inflate the count — link text is kept, since it's
// still read. The +2 min flat buffer is calibrated against this site's own
// previously hand-set read times, which consistently ran ~2 min longer than
// a plain words/200wpm estimate (presumably to account for time spent on
// dialogue-heavy/literary pacing rather than skimmable prose).
export function calculateReadTime(markdown) {
  let text = stripFencedCode(markdown)
  text = text.replace(/<[^>]+>/g, ' ')
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  text = text.replace(/\$\$[\s\S]*?\$\$/g, ' ')
  text = text.replace(/\$[^$\n]*\$/g, ' ')
  text = text.replace(/[#>*_`~|-]/g, ' ')
  text = text.replace(/\s+/g, ' ').trim()

  const words = text ? text.split(' ').length : 0
  const minutes = Math.round(words / WORDS_PER_MINUTE) + EXTRA_MINUTES
  return `${minutes} min read`
}
