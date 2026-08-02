import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { experience } from '../data/content.js'

export default function Experience() {
  return (
    <section id="experience" className="px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-content">
        <SectionHeading eyebrow="Experience" title="Where I've worked" note="Newest first" />

        <ol className="relative">
          <div aria-hidden="true" className="absolute left-[7.5rem] top-2 hidden h-[calc(100%-1rem)] w-px bg-line dark:bg-seam sm:block" />
          {experience.map((job, i) => (
            <Reveal as="li" key={job.title + job.org} delay={i * 0.05} className="relative grid grid-cols-1 gap-2 py-6 sm:grid-cols-[7rem_1fr] sm:gap-8">
              <div className="flex items-center gap-3 sm:justify-end sm:text-right">
                <span
                  aria-hidden="true"
                  className={`hidden h-2 w-2 shrink-0 rounded-full sm:block ${
                    job.current ? 'bg-marker' : 'bg-ink-faint dark:bg-parchment-faint'
                  }`}
                />
                <p className="font-mono text-[12px] leading-relaxed text-ink-muted dark:text-parchment-muted">
                  {job.start} — {job.end}
                </p>
              </div>
              <div>
                <h3 className="font-display text-lg text-ink dark:text-parchment">
                  {job.title}
                  {job.employmentType && (
                    <span className="ml-2 text-sm font-sans font-normal text-ink-faint dark:text-parchment-faint">
                      ({job.employmentType})
                    </span>
                  )}
                </h3>
                <p className="mt-0.5 text-sm text-ink-muted dark:text-parchment-muted">
                  {job.orgHref ? (
                    <a href={job.orgHref} target="_blank" rel="noreferrer" className="mark-line text-ink dark:text-parchment">
                      {job.org}
                    </a>
                  ) : (
                    job.org
                  )}
                  {' · '}
                  {job.location}
                </p>
                {job.description && (
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted dark:text-parchment-muted">
                    {job.description}
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
