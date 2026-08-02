import { Link } from 'react-router-dom'
import DraftBadge from './blog/DraftBadge.jsx'

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function CategoryTags({ categories, className = '' }) {
  if (!categories?.length) return null
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {categories.map((c) => (
        <li
          key={c}
          className="rounded-full border hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted dark:text-parchment-muted"
        >
          {c}
        </li>
      ))}
    </ul>
  )
}

export default function BlogCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border hairline transition-all hover:-translate-y-1 hover:border-marker"
    >
      {post.cover && (
        <div className="aspect-[16/10] w-full overflow-hidden">
          <img
            src={post.cover}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint dark:text-parchment-faint">
            {post.readTime} · {formatDate(post.date)}
          </p>
          {post.status === 'draft' && <DraftBadge />}
        </div>
        <CategoryTags categories={post.categories} className="mt-2" />
        <h3 className="mark-line mt-2 font-display text-lg text-ink dark:text-parchment">
          {post.title}
        </h3>
        <p className="mt-2 font-serifText text-sm italic text-ink-muted dark:text-parchment-muted">
          {post.subtitle}
        </p>
      </div>
    </Link>
  )
}
