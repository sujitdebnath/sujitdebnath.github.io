import { ArrowUpRight, FolderPlus } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { projects } from '../data/content.js'

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-content">
        <SectionHeading eyebrow="Projects" title="Things I've built" />

        {projects.length === 0 ? (
          <Reveal className="flex flex-col items-start gap-3 rounded-2xl border border-dashed hairline p-10">
            <FolderPlus size={20} strokeWidth={1.5} className="text-marker" />
            <p className="font-display text-lg text-ink dark:text-parchment">
              No projects added yet
            </p>
            <p className="max-w-prose text-sm leading-relaxed text-ink-muted dark:text-parchment-muted">
              Add your first one to <code className="font-mono text-xs">src/data/content.js</code> —
              a title, a short description, a few tags, and a link is all this card needs.
            </p>
          </Reveal>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 0.05}
                className="group flex h-full flex-col rounded-2xl border hairline p-6 transition-all hover:-translate-y-1 hover:border-marker"
              >
                <h3 className="font-display text-lg text-ink dark:text-parchment">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted dark:text-parchment-muted">
                  {p.description}
                </p>
                {p.tags?.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border hairline px-2.5 py-1 font-mono text-[11px] text-ink-muted dark:text-parchment-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
                {p.href && (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mark-line mt-5 inline-flex items-center gap-1 font-mono text-[12px] text-ink dark:text-parchment"
                  >
                    View <ArrowUpRight size={12} strokeWidth={1.75} />
                  </a>
                )}
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
