import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import BlogCard, { CategoryTags, formatDate } from '../components/BlogCard.jsx'
import DraftBadge from '../components/blog/DraftBadge.jsx'
import FeaturedBadge from '../components/blog/FeaturedBadge.jsx'
import Dropdown from '../components/blog/Dropdown.jsx'
import { blogPosts } from '../data/posts.js'
import { categories as taxonomyCategories } from '../data/taxonomy.js'

const POSTS_PER_PAGE = 6

// Standard truncated-pagination pattern: always show first/last page, the
// current page and its immediate neighbors, and collapse any gap into a
// single ellipsis. Below the truncation threshold, just show every page.
function getPaginationItems(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => ({ type: 'page', value: i + 1 }))
  }

  const pageNumbers = [1, total, current - 1, current, current + 1].filter(
    (n) => n >= 1 && n <= total
  )
  const uniqueSorted = Array.from(new Set(pageNumbers)).sort((a, b) => a - b)

  const items = []
  uniqueSorted.forEach((n, i) => {
    if (i > 0 && n - uniqueSorted[i - 1] > 1) {
      items.push({ type: 'ellipsis', key: `ellipsis-${n}` })
    }
    items.push({ type: 'page', value: n })
  })
  return items
}

function FilterLabel({ children }) {
  return (
    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint dark:text-parchment-faint">
      {children}
    </p>
  )
}

export default function Blog() {
  const posts = useMemo(
    () => [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date)),
    []
  )

  const featuredPosts = useMemo(() => posts.filter((post) => post.featured), [posts])

  const mainCategories = useMemo(() => ['All', ...Object.keys(taxonomyCategories)], [])

  const tagOptions = useMemo(() => {
    const set = new Set()
    posts.forEach((post) => post.tags?.forEach((t) => set.add(t)))
    return ['All', ...Array.from(set).sort()]
  }, [posts])

  const years = useMemo(() => {
    const set = new Set(posts.map((post) => new Date(post.date).getFullYear()))
    return ['All', ...Array.from(set).sort((a, b) => b - a)]
  }, [posts])

  const [category, setCategory] = useState('All')
  const [subcategory, setSubcategory] = useState('All')
  const [tag, setTag] = useState('All')
  const [year, setYear] = useState('All')
  const [page, setPage] = useState(1)

  const subcategoryOptions = useMemo(() => {
    if (category === 'All') return ['All']
    return ['All', ...(taxonomyCategories[category] || [])]
  }, [category])

  const filtersActive = category !== 'All' || subcategory !== 'All' || tag !== 'All' || year !== 'All'

  const filtered = posts.filter((post) => {
    const categoryMatch = category === 'All' || post.category === category
    const subcategoryMatch = subcategory === 'All' || post.subcategories?.includes(subcategory)
    const tagMatch = tag === 'All' || post.tags?.includes(tag)
    const yearMatch = year === 'All' || new Date(post.date).getFullYear() === year
    return categoryMatch && subcategoryMatch && tagMatch && yearMatch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginatedPosts = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  )
  const paginationItems = getPaginationItems(currentPage, totalPages)

  function selectCategory(next) {
    setCategory(next)
    setSubcategory('All')
    setPage(1)
  }

  function selectSubcategory(next) {
    setSubcategory(next)
    setPage(1)
  }

  function selectTag(next) {
    setTag(next)
    setPage(1)
  }

  function selectYear(next) {
    setYear(next === 'All' ? 'All' : Number(next))
    setPage(1)
  }

  function clearFilters() {
    setCategory('All')
    setSubcategory('All')
    setTag('All')
    setYear('All')
    setPage(1)
  }

  return (
    <div className="px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-content">
        <Reveal className="text-center">
          <p className="eyebrow mb-4">[ Journals ]</p>
          <h1 className="font-display text-4xl text-ink dark:text-parchment sm:text-5xl">
            Sujit's Blog
          </h1>
          <p className="mx-auto mt-3 max-w-prose font-display text-lg italic leading-snug text-ink-muted dark:text-parchment-muted sm:text-xl">
            life, work, and journeys in between
          </p>
        </Reveal>

        {featuredPosts.length > 0 && (
          <Reveal delay={0.05} className="mt-16">
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint dark:text-parchment-faint">
              Featured
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 0.05}>
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.1} className="mt-16">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint dark:text-parchment-faint">
            All Entries
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] lg:gap-10">
            <div className="border-t hairline" />
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_260px] lg:items-start">
            <aside className="lg:col-start-2 lg:row-start-1">
              {filtersActive && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mark-line mb-6 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted hover:text-marker dark:text-parchment-muted"
                >
                  Clear filters
                </button>
              )}

              <div>
                <FilterLabel>Main Category</FilterLabel>
                <div className="flex flex-col gap-2">
                  {mainCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => selectCategory(cat)}
                      className={`rounded-full border px-3 py-1.5 text-left font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
                        category === cat
                          ? 'border-marker text-ink dark:text-parchment'
                          : 'hairline text-ink-muted hover:border-marker dark:text-parchment-muted'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <FilterLabel>Subcategory</FilterLabel>
                <Dropdown
                  value={subcategory}
                  options={subcategoryOptions}
                  onChange={selectSubcategory}
                  disabled={category === 'All'}
                />
              </div>

              <div className="mt-8">
                <FilterLabel>Tags</FilterLabel>
                <Dropdown
                  value={tag}
                  options={tagOptions}
                  onChange={selectTag}
                  uppercase={false}
                />
              </div>

              <div className="mt-8">
                <FilterLabel>Year</FilterLabel>
                <Dropdown value={year} options={years} onChange={selectYear} />
              </div>
            </aside>

            <div className="lg:col-start-1 lg:row-start-1">
              {paginatedPosts.length === 0 ? (
                <p className="mt-10 text-sm text-ink-muted dark:text-parchment-muted">
                  No posts match these filters yet.
                </p>
              ) : (
                <ol className="divide-y hairline">
                  {paginatedPosts.map((post, i) => (
                    <Reveal as="li" key={post.slug} delay={i * 0.05}>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="group flex flex-col gap-6 py-10 sm:flex-row sm:items-start"
                      >
                        {post.cover && (
                          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl border hairline sm:w-48 md:w-56 lg:w-64">
                            {post.featured && (
                              <FeaturedBadge className="absolute left-2 top-2 z-10" />
                            )}
                            <img
                              src={post.cover}
                              alt=""
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint dark:text-parchment-faint">
                              {post.readTime} · {formatDate(post.date)}
                            </p>
                            {post.status === 'draft' && <DraftBadge />}
                          </div>
                          <CategoryTags
                            category={post.category}
                            subcategories={post.subcategories}
                            tags={post.tags}
                            className="mt-3"
                          />
                          <h2 className="mark-line mt-3 font-display text-2xl text-ink dark:text-parchment">
                            {post.title}
                          </h2>
                          <p className="mt-2 font-serifText text-sm italic text-ink-muted dark:text-parchment-muted">
                            {post.subtitle}
                          </p>
                          {post.preview && (
                            <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-muted dark:text-parchment-muted">
                              {post.preview}
                            </p>
                          )}
                          <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[12px] text-ink dark:text-parchment">
                            Read
                            <ArrowUpRight
                              size={13}
                              strokeWidth={1.75}
                              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-marker"
                            />
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </ol>
              )}

              <nav
                className="mt-14 flex items-center gap-1 font-mono text-sm"
                aria-label="Pagination"
              >
                <button
                  type="button"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30 dark:text-parchment-muted dark:hover:text-parchment"
                >
                  <ChevronLeft size={16} strokeWidth={1.75} />
                </button>

                {paginationItems.map((item) =>
                  item.type === 'ellipsis' ? (
                    <span
                      key={item.key}
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center text-ink-faint dark:text-parchment-faint"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setPage(item.value)}
                      aria-current={currentPage === item.value ? 'page' : undefined}
                      className={`mark-line flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                        currentPage === item.value
                          ? 'is-active text-marker'
                          : 'text-ink-muted hover:text-ink dark:text-parchment-muted dark:hover:text-parchment'
                      }`}
                    >
                      {item.value}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30 dark:text-parchment-muted dark:hover:text-parchment"
                >
                  <ChevronRight size={16} strokeWidth={1.75} />
                </button>
              </nav>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
