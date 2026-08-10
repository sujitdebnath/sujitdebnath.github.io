import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import { bucketList } from '../data/bucketlist.js'

function formatMonthYear(value) {
  const [year, month] = value.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}

export default function BucketList() {
  const categories = useMemo(
    () => ['All', ...new Set(bucketList.map((item) => item.category))],
    []
  )
  const [category, setCategory] = useState('All')
  const filteredList = useMemo(
    () => (category === 'All' ? bucketList : bucketList.filter((item) => item.category === category)),
    [category]
  )

  const total = filteredList.length
  const done = filteredList.filter((item) => item.done).length

  return (
    <div className="px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-content">
        <Reveal>
          <p className="eyebrow mb-4">[ A Living List ]</p>
          <h1 className="font-display text-4xl text-ink dark:text-parchment sm:text-5xl">
            The Bucket List
          </h1>
          <p className="mt-5 max-w-prose text-ink-muted dark:text-parchment-muted">
            Places to go, things to learn, and a few reckless goals — kept here, in
            public, instead of a notes app I'd never reopen.
          </p>
          <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-faint dark:text-parchment-faint">
            {done} / {total} done
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
                  category === cat
                    ? 'border-marker text-ink dark:text-parchment'
                    : 'hairline text-ink-muted hover:border-marker dark:text-parchment-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        <ul className="mt-10 divide-y hairline border-t hairline">
          {filteredList.map((item, i) => (
            <Reveal as="li" key={`${item.category}:${item.label}`} delay={Math.min(i * 0.02, 0.4)}>
              <div className="flex items-start gap-3 py-4">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    item.done ? 'border-marker bg-marker' : 'border-line dark:border-seam'
                  }`}
                >
                  {item.done && <Check size={12} strokeWidth={3} className="text-marker-ink" />}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
                    <span className="text-sm text-ink dark:text-parchment sm:text-base">
                      {item.label}
                    </span>
                    <span className="shrink-0 rounded-full border border-marker bg-transparent px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink dark:text-parchment">
                      {item.category}
                    </span>
                  </div>

                  <p className="mt-1 font-mono text-[11px] text-ink-faint dark:text-parchment-faint">
                    {item.done ? (
                      <>
                        {formatMonthYear(item.completedDate)}
                        {item.blogSlug ? (
                          <>
                            {' · '}
                            <Link
                              to={`/blog/${item.blogSlug}`}
                              className="group mark-line inline-flex items-center gap-1 text-ink-muted dark:text-parchment-muted"
                            >
                              Read the story
                              <ArrowUpRight
                                size={11}
                                strokeWidth={1.75}
                                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              />
                            </Link>
                          </>
                        ) : (
                          ' · No post yet'
                        )}
                      </>
                    ) : (
                      'Not finished yet'
                    )}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  )
}
