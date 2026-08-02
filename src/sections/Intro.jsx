import { motion, useReducedMotion } from 'framer-motion'
import { Mail, Phone, Github, Linkedin, Twitter, BookOpen, MapPin } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import { renderRich } from '../lib/richText.jsx'
import { profile } from '../data/content.js'

const SOCIAL_ICONS = {
  GitHub: Github,
  LinkedIn: Linkedin,
  'Twitter / X': Twitter,
  Goodreads: BookOpen,
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export default function Intro() {
  const prefersReducedMotion = useReducedMotion()
  const item = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section id="about" className="px-6 py-10 sm:py-12">
      <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-content">
        <motion.p variants={item} className="eyebrow mb-4">
          [ Engineer in progress ]
        </motion.p>
        <motion.h1
          variants={item}
          className="font-display text-4xl leading-[1.05] tracking-tight text-ink dark:text-parchment sm:text-5xl"
        >
          {profile.name}
        </motion.h1>
        <motion.p
          variants={item}
          className="eyebrow mt-3"
        >
          {profile.descriptors}
        </motion.p>
        <motion.p
          variants={item}
          className="mt-3 max-w-prose font-serifText text-lg italic leading-snug text-ink-muted dark:text-parchment-muted sm:text-xl"
        >
          {profile.tagline}
        </motion.p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[16rem_1fr]">
          <Reveal className="mx-auto w-full max-w-[16rem] lg:mx-0">
            <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border hairline bg-paper-surface dark:bg-night-surface">
              <img
                src={profile.photo}
                alt={profile.name}
                className="h-full w-full object-cover grayscale contrast-[1.05]"
              />
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-2 font-mono text-[12px] text-ink-muted dark:text-parchment-muted">
                <MapPin size={13} strokeWidth={1.75} />
                {profile.location}
              </li>
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="mark-line inline-flex items-center gap-2 font-mono text-[12px] text-ink dark:text-parchment"
                >
                  <Mail size={13} strokeWidth={1.75} />
                  {profile.email}
                </a>
              </li>
              {profile.phone && (
                <li>
                  <a
                    href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                    className="mark-line inline-flex items-center gap-2 font-mono text-[12px] text-ink dark:text-parchment"
                  >
                    <Phone size={13} strokeWidth={1.75} />
                    {profile.phone}
                  </a>
                </li>
              )}
              {profile.socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.label]
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mark-line inline-flex items-center gap-2 font-mono text-[12px] text-ink-muted dark:text-parchment-muted hover:text-ink dark:hover:text-parchment"
                    >
                      {Icon && <Icon size={13} strokeWidth={1.75} />}
                      {s.handle}
                    </a>
                  </li>
                )
              })}
            </ul>
          </Reveal>

          <div className="max-w-prose space-y-5 text-[1.05rem] leading-relaxed text-ink-muted dark:text-parchment-muted">
            {profile.bio.map((para, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p>{renderRich(para.text, para.links)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
