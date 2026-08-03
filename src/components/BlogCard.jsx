import { Link } from 'react-router-dom'
import DraftBadge from './blog/DraftBadge.jsx'
import FeaturedBadge from './blog/FeaturedBadge.jsx'

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function CategoryTags({ category, subcategories, tags, className = '' }) {
  if (!category && !subcategories?.length && !tags?.length) return null
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(category || subcategories?.length > 0) && (
        <ul className="flex flex-wrap items-center gap-1.5">
          {category && (
            <li className="rounded-full border border-marker bg-transparent px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink dark:text-parchment">
              {category}
            </li>
          )}
          {subcategories?.map((c) => (
            <li
              key={c}
              className="rounded-full border hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted dark:text-parchment-muted"
            >
              {c}
            </li>
          ))}
        </ul>
      )}
      {tags?.length > 0 && (
        <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {tags.map((t) => (
            <li
              key={t}
              className="font-mono text-[10px] tracking-[0.02em] text-ink-faint dark:text-parchment-faint"
            >
              #{t}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function BlogCard({ post, showFeaturedBadge = false }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border hairline transition-all hover:-translate-y-1 hover:border-marker"
    >
      {post.cover && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {showFeaturedBadge && post.featured && (
            <FeaturedBadge className="absolute left-2 top-2 z-10" />
          )}
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
        <CategoryTags
          category={post.category}
          subcategories={post.subcategories}
          tags={post.tags}
          className="mt-2"
        />
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
