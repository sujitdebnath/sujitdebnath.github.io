import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { education } from '../data/content.js'

export default function Education() {
  return (
    <section id="education" className="px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-content">
        <SectionHeading eyebrow="Education" title="Where I studied" />

        <ol className="relative">
          <div aria-hidden="true" className="absolute left-[7.5rem] top-2 hidden h-[calc(100%-1rem)] w-px bg-line dark:bg-seam sm:block" />
          {education.map((ed, i) => (
            <Reveal as="li" key={ed.degree} delay={i * 0.06} className="relative grid grid-cols-1 gap-2 py-6 sm:grid-cols-[7rem_1fr] sm:gap-8">
              <div className="flex items-center gap-3 sm:justify-end sm:text-right">
                <span
                  aria-hidden="true"
                  className={`hidden h-2 w-2 shrink-0 rounded-full sm:block ${
                    ed.current ? 'bg-marker' : 'bg-ink-faint dark:bg-parchment-faint'
                  }`}
                />
                <p className="font-mono text-[12px] leading-relaxed text-ink-muted dark:text-parchment-muted">
                  {ed.start} — {ed.end}
                </p>
              </div>
              <div>
                <h3 className="font-display text-lg text-ink dark:text-parchment">
                  {ed.degree}
                  {ed.qualifier && (
                    <span className="ml-2 text-sm font-sans font-normal text-ink-faint dark:text-parchment-faint">
                      ({ed.qualifier})
                    </span>
                  )}
                </h3>
                <p className="mt-1 text-sm text-ink-muted dark:text-parchment-muted">
                  {ed.institutionHref ? (
                    <a href={ed.institutionHref} target="_blank" rel="noreferrer" className="mark-line text-ink dark:text-parchment">
                      {ed.institution}
                    </a>
                  ) : (
                    ed.institution
                  )}
                </p>
                <p className="text-xs text-ink-faint dark:text-parchment-faint">{ed.location}</p>
                {ed.details && (
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted dark:text-parchment-muted">
                    {ed.details}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
