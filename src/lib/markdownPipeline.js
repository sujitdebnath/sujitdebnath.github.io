import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'

export const remarkPlugins = [remarkGfm, remarkMath]

export const rehypePlugins = [
  rehypeRaw,
  rehypeKatex,
  [rehypeHighlight, { detect: false, ignoreMissing: true }],
]

// Flattens a react-markdown `children` prop (strings, arrays, and elements
// produced by rehype-highlight's <span class="hljs-*"> wrapping) back down
// to the original source text of a code block.
export function getNodeText(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getNodeText).join('')
  if (node?.props?.children != null) return getNodeText(node.props.children)
  return ''
}
