import Reveal from '../components/Reveal.jsx'
import { quote } from '../data/content.js'

export default function Quote() {
  return (
    <section className="px-6 py-10 sm:py-12">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="font-display text-xl italic leading-snug text-ink dark:text-parchment sm:text-2xl">
          <span className="text-marker">“</span>
          {quote.text}
          <span className="text-marker">”</span>
        </p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint dark:text-parchment-faint">
          {quote.author}
        </p>
      </Reveal>
    </section>
  )
}
