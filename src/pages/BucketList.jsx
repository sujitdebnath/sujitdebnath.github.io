import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import { bucketList } from '../data/content.js'

const STORAGE_KEY = 'bucket-list-checked'

function loadChecked() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export default function BucketList() {
  const [checked, setChecked] = useState(loadChecked)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked))
  }, [checked])

  const toggle = (key, initialDone) => {
    setChecked((prev) => {
      const current = key in prev ? prev[key] : initialDone
      return { ...prev, [key]: !current }
    })
  }

  const total = bucketList.reduce((sum, group) => sum + group.items.length, 0)
  const done = bucketList.reduce(
    (sum, group) =>
      sum +
      group.items.filter((item) => {
        const key = `${group.category}:${item.label}`
        return key in checked ? checked[key] : item.done
      }).length,
    0
  )

  return (
    <div className="px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-content">
        <Reveal>
          <p className="eyebrow mb-4">[ A running list ]</p>
          <h1 className="font-display text-4xl text-ink dark:text-parchment sm:text-5xl">
            The Bucket List
          </h1>
          <p className="mt-5 max-w-prose text-ink-muted dark:text-parchment-muted">
            Places to go, things to learn, and a few reckless-sounding goals — kept honest
            here instead of in a notes app I never reopen.
          </p>
          <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-faint dark:text-parchment-faint">
            {done} / {total} done
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 sm:grid-cols-2">
          {bucketList.map((group, gi) => (
            <Reveal key={group.category} delay={gi * 0.05}>
              <h2 className="font-display text-xl text-ink dark:text-parchment">
                {group.category}
              </h2>
              <ul className="mt-4 space-y-1 border-t hairline pt-4">
                {group.items.map((item) => {
                  const key = `${group.category}:${item.label}`
                  const isDone = key in checked ? checked[key] : item.done
                  return (
                    <li key={key}>
                      <button
                        onClick={() => toggle(key, item.done)}
                        className="group flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-ink/[0.03] dark:hover:bg-parchment/[0.05]"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            isDone
                              ? 'border-marker bg-marker'
                              : 'border-line dark:border-seam group-hover:border-marker'
                          }`}
                        >
                          {isDone && <Check size={12} strokeWidth={3} className="text-marker-ink" />}
                        </span>
                        <span
                          className={`text-sm sm:text-base ${
                            isDone
                              ? 'text-ink-faint line-through dark:text-parchment-faint'
                              : 'text-ink dark:text-parchment'
                          }`}
                        >
                          {item.label}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
