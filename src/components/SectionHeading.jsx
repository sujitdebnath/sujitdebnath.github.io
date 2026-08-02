import Reveal from './Reveal.jsx'

export default function SectionHeading({ eyebrow, title, note }) {
  return (
    <Reveal className="mb-8 flex items-end justify-between gap-6 border-b hairline pb-5">
      <div>
        {eyebrow && <p className="eyebrow mb-2">[ {eyebrow} ]</p>}
        <h2 className="font-display text-3xl text-ink dark:text-parchment sm:text-4xl">
          {title}
        </h2>
      </div>
      {note && (
        <p className="hidden max-w-[14rem] shrink-0 text-right text-sm text-ink-muted dark:text-parchment-muted sm:block">
          {note}
        </p>
      )}
    </Reveal>
  )
}
