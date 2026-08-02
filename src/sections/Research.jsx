import { ArrowUpRight } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { research } from '../data/content.js'

export default function Research() {
  return (
    <section id="research" className="px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-content">
        <SectionHeading eyebrow="Research" title="What I'm working on" />

        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            {research.current.map((r, i) => (
              <Reveal
                key={r.title}
                delay={i * 0.06}
                className="rounded-2xl border hairline p-6 transition-colors hover:border-marker"
              >
                <p className={`eyebrow mb-2 ${r.status === 'Ongoing' ? 'text-marker' : ''}`}>{r.status}</p>
                <h3 className="font-display text-lg text-ink dark:text-parchment">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-parchment-muted">
                  {r.description}
                </p>
              </Reveal>
            ))}
          </div>

          <div>
            <p className="eyebrow mb-4">Selected publications</p>
            <ol className="space-y-6">
              {research.publications.map((pub, i) => (
                <Reveal as="li" key={pub.title} delay={i * 0.06}>
                  <h4 className="font-display text-base leading-snug text-ink dark:text-parchment">
                    <span className="mr-1.5 font-mono text-xs text-ink-faint dark:text-parchment-faint">
                      [{i + 1}]
                    </span>
                    {pub.title}
                  </h4>
                  <p className="mt-1.5 text-sm text-ink-muted dark:text-parchment-muted">{pub.authors}</p>
                  <p className="mt-1 text-sm italic text-ink-muted dark:text-parchment-muted">
                    {pub.venue} — {pub.location}, {pub.year}
                    {pub.pages && `, ${pub.pages}`}
                  </p>
                  <a
                    href={pub.doi}
                    target="_blank"
                    rel="noreferrer"
                    className="mark-line mt-2 inline-flex items-center gap-1 font-mono text-[12px] text-ink dark:text-parchment"
                  >
                    View DOI <ArrowUpRight size={12} strokeWidth={1.75} />
                  </a>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
