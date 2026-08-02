import { motion, useReducedMotion } from 'framer-motion'

/**
 * The site's signature move: text that gets highlighter-marked as it
 * scrolls into view, like a pen dragged under a line in a notebook.
 */
export default function Mark({ children, className = '' }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 bg-marker/40"
        style={{ height: '38%', transformOrigin: 'left' }}
        initial={{ scaleX: prefersReducedMotion ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
      />
      <span className="relative">{children}</span>
    </span>
  )
}
