import { motion, useReducedMotion } from 'framer-motion'

/**
 * Fades + rises content into view once, the first time it enters the
 * viewport. Respects prefers-reduced-motion (fades only, no movement).
 */
export default function Reveal({ children, delay = 0, y = 16, as = 'div', className = '' }) {
  const prefersReducedMotion = useReducedMotion()
  const Component = motion[as] || motion.div

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}
