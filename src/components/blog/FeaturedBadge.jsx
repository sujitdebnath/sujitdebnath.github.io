import { Star } from 'lucide-react'

// Solid-fill badge for use as an overlay on top of photo content (cover
// images/thumbnails) — needs a background that stays legible regardless of
// what's underneath, unlike the outline pills used on plain backgrounds
// elsewhere on the site.
const SIZES = {
  sm: { badge: 'gap-1 px-2 py-0.5 text-[10px]', icon: 10 },
  md: { badge: 'gap-1.5 px-2.5 py-1 text-[11px]', icon: 11 },
}

export default function FeaturedBadge({ size = 'sm', className = '' }) {
  const { badge, icon } = SIZES[size]
  return (
    <span
      className={`inline-flex items-center rounded-full bg-marker font-mono font-bold uppercase tracking-[0.08em] text-marker-ink ${badge} ${className}`}
    >
      <Star size={icon} strokeWidth={0} fill="currentColor" />
      Featured
    </span>
  )
}
