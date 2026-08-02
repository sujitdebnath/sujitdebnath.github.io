import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'
import { nav, profile } from '../data/content.js'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const linkHref = (item) => (item.to ? item.to : `/${item.hash}`)

  const anchorLinks = nav.filter((item) => item.hash)
  const pageLinks = nav.filter((item) => item.to)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-paper/90 dark:bg-night/90 backdrop-blur border-b hairline'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="font-display italic text-xl tracking-tight text-ink dark:text-parchment"
        >
          {profile.initials}
          <span className="text-marker">.</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <div className="flex items-center gap-7">
            {anchorLinks.map((item) => (
              <Link
                key={item.label}
                to={linkHref(item)}
                className="mark-line eyebrow !text-[12px] !tracking-[0.14em] text-ink dark:text-parchment hover:!text-ink dark:hover:!text-parchment"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <span className="h-4 border-l hairline" aria-hidden="true" />
          <div className="flex items-center gap-7">
            {pageLinks.map((item) => (
              <Link
                key={item.label}
                to={linkHref(item)}
                className="mark-line eyebrow !text-[12px] !tracking-[0.14em] text-ink dark:text-parchment hover:!text-ink dark:hover:!text-parchment"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full border hairline"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t hairline bg-paper dark:bg-night px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {anchorLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={linkHref(item)}
                  className="eyebrow !text-[13px] text-ink dark:text-parchment"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="my-4 border-t hairline" aria-hidden="true" />
          <ul className="flex flex-col gap-4">
            {pageLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={linkHref(item)}
                  className="eyebrow !text-[13px] text-ink dark:text-parchment"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
