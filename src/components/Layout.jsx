import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'

export default function Layout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Give the route's content a tick to render before we try to find it.
      const id = hash.replace('#', '')
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return () => cancelAnimationFrame(raf)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      {/* min-w-0 overrides the flex item's default min-width: auto, which
          otherwise sizes `main` to fit its widest descendant's min-content —
          a `w-screen` full-bleed element (img-full, the Travel Log map)
          nested anywhere inside stretches `main` (and the whole page) to
          that width instead of being clipped/centered as intended. This was
          latent until round 50 actually rendered a live w-screen element. */}
      <main className="min-w-0 flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
