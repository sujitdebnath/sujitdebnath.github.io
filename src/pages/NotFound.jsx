import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-marker">404</p>
      <h1 className="mt-3 font-display text-3xl text-ink dark:text-parchment">
        This page wandered off.
      </h1>
      <Link to="/" className="mark-line mt-6 font-mono text-sm text-ink dark:text-parchment">
        ← Back home
      </Link>
    </div>
  )
}
