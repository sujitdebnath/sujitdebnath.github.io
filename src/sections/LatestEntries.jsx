import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import BlogCard from '../components/BlogCard.jsx'
import { blogPosts } from '../data/posts.js'

export default function LatestEntries() {
  const posts = [...blogPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  if (posts.length === 0) return null

  return (
    <section className="px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-content">
        <SectionHeading eyebrow="Journals" title="Sujit's Blog — Latest Entries" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <Link
            to="/blog"
            className="mark-line mt-8 inline-flex items-center gap-1 font-mono text-[12px] text-ink dark:text-parchment"
          >
            View all entries <ArrowUpRight size={12} strokeWidth={1.75} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
