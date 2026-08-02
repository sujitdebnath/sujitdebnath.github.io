import { ArrowUpRight } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import { coffeeChat } from '../data/content.js'

export default function CoffeeChat() {
  return (
    <section id="coffee-chat" className="px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-content">
        <Reveal>
          <p className="eyebrow mb-3">[ Coffee Chat ]</p>
          <h2 className="font-display text-2xl text-ink dark:text-parchment sm:text-3xl">
            {coffeeChat.title}
          </h2>
          <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-muted dark:text-parchment-muted">
            {coffeeChat.intro}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-14">
          <Reveal delay={0.06}>
            <p className="eyebrow mb-4">{coffeeChat.topicsLabel}</p>
            <ul className="space-y-2.5">
              {coffeeChat.topics.map((topic) => (
                <li
                  key={topic}
                  className="flex gap-2.5 text-sm leading-relaxed text-ink-muted dark:text-parchment-muted"
                >
                  <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-marker" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={0.12}
            className="flex flex-col rounded-2xl border hairline p-6 transition-colors hover:border-marker"
          >
            <h3 className="font-display text-lg text-ink dark:text-parchment">{coffeeChat.card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-parchment-muted">
              {coffeeChat.card.description}
            </p>
            <a
              href={coffeeChat.card.href}
              target="_blank"
              rel="noreferrer"
              className="mark-line mt-5 inline-flex items-center gap-1 font-mono text-[12px] text-ink dark:text-parchment"
            >
              {coffeeChat.card.cta} <ArrowUpRight size={12} strokeWidth={1.75} />
            </a>
          </Reveal>
        </div>

        {coffeeChat.donationNote && (
          <Reveal delay={0.18}>
            <p className="mt-8 max-w-2xl text-sm italic text-ink-faint dark:text-parchment-faint">
              {coffeeChat.donationNote}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
