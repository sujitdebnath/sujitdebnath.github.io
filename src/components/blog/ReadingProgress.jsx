import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

// Fallback matching Layout.jsx's `pt-16` until the real header height is
// measured — the header's actual rendered height can differ slightly
// (padding/border), so it's read directly rather than assumed.
const FALLBACK_NAV_HEIGHT = 64

/**
 * Thin accent-colored bar flush against the bottom of the nav that fills
 * as the reader scrolls through `target` (the post's content container).
 */
export default function ReadingProgress({ target }) {
  const prefersReducedMotion = useReducedMotion()
  const [navHeight, setNavHeight] = useState(FALLBACK_NAV_HEIGHT)

  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return undefined

    const updateHeight = () => setNavHeight(header.offsetHeight)
    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target,
    offset: ['start start', 'end end'],
  })
  const spring = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 z-40 h-[3px] w-full bg-marker"
      style={{
        top: navHeight,
        scaleX: prefersReducedMotion ? scrollYProgress : spring,
        transformOrigin: 'left',
      }}
    />
  )
}
