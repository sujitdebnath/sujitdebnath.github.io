import { useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, MapPin } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import { blogPosts } from '../data/posts.js'
import { remarkPlugins, rehypePlugins } from '../lib/markdownPipeline.js'
import { extractHeadings, remarkHeadingIds } from '../lib/postHeadings.js'
import { extractLocations, rehypeLocationIds } from '../lib/postLocations.js'
import { CodePre, CodeInline } from '../components/blog/CodeBlock.jsx'
import { TocDesktopNav, TocMobileDetails } from '../components/blog/TableOfContents.jsx'
import TikZLoader from '../components/blog/TikZLoader.jsx'
import PostGallery from '../components/blog/PostGallery.jsx'
import PhotoGroup from '../components/blog/PhotoGroup.jsx'
import ReviewMeta from '../components/blog/ReviewMeta.jsx'
import DraftBadge from '../components/blog/DraftBadge.jsx'
import FeaturedBadge from '../components/blog/FeaturedBadge.jsx'
import { CategoryTags } from '../components/BlogCard.jsx'
import CitationMarker from '../components/blog/CitationMarker.jsx'
import References from '../components/blog/References.jsx'
import ReadingProgress from '../components/blog/ReadingProgress.jsx'
import { extractBibliography, extractCitationOrder, remarkCitations } from '../lib/citations.js'
import 'katex/dist/katex.min.css'

const SceneBreak = () => (
  <div
    aria-hidden="true"
    className="flex justify-center py-2 font-mono text-xs tracking-[0.4em] text-ink-faint dark:text-parchment-faint"
  >
    • • •
  </div>
)

const IMG_CAPTION_CLASS =
  'mx-auto mt-3 max-w-prose px-6 text-center font-mono text-[12px] text-ink-muted dark:text-parchment-muted'

const DEFAULT_IMG_VARIANT = {
  figure: 'my-6',
  img: 'w-full rounded-2xl border hairline',
  caption: true,
}

// Reads the raw hast children of a `.photo-group` div directly (rather
// than letting react-markdown recurse into the normal `img` component),
// since size classes mean something different inside a group than they
// do standalone — see IMG_VARIANTS vs this mapping.
const GROUP_SIZE_BY_CLASS = {
  'img-large': 'large',
  'img-tall': 'tall',
  'img-wide': 'wide',
}
function extractGroupPhotos(node) {
  return (node?.children || [])
    .filter((child) => child.tagName === 'img')
    .map((child) => {
      const props = child.properties || {}
      const classes = Array.isArray(props.className) ? props.className : []
      const sizeClass = classes.find((c) => GROUP_SIZE_BY_CLASS[c])
      return {
        src: props.src,
        caption: props.alt || '',
        size: GROUP_SIZE_BY_CLASS[sizeClass] || 'normal',
      }
    })
}

function LocationNav({ locations }) {
  return (
    <nav aria-label="Trip stops" className="location-nav flex flex-wrap gap-2">
      {locations.map((location) => (
        <a
          key={location.slug}
          href={`#${location.slug}`}
          className="rounded-full border hairline px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted transition-colors hover:border-marker dark:text-parchment-muted"
        >
          {location.text}
        </a>
      ))}
    </nav>
  )
}

const IMG_VARIANTS = {
  'img-large': {
    figure: 'my-8 lg:-ml-[7rem] lg:-mr-[7rem] lg:w-[calc(100%+14rem)]',
    img: 'w-full rounded-2xl border hairline',
    caption: true,
  },
  'img-full': {
    figure: 'relative left-1/2 my-8 -ml-[50vw] -mr-[50vw] w-screen',
    img: 'w-full',
    caption: true,
  },
  'img-tall': {
    figure: 'my-8',
    img: 'aspect-[3/4] w-full rounded-2xl border hairline object-cover',
    caption: true,
  },
  'img-float-right': {
    img: 'img-float w-full rounded-2xl border hairline sm:float-right sm:mb-4 sm:ml-6 sm:w-[42%]',
  },
  'img-float-left': {
    img: 'img-float w-full rounded-2xl border hairline sm:float-left sm:mb-4 sm:mr-6 sm:w-[42%]',
  },
}

function useMarkdownComponents(headings, bibliography, isReview, locations) {
  return useMemo(() => {
    return {
      hr: SceneBreak,
      pre: CodePre,
      code: CodeInline,
      div: ({ node, className, children, ...props }) => {
        if (className === 'photo-group') {
          return <PhotoGroup photos={extractGroupPhotos(node)} />
        }
        if (className === 'location') {
          const isFirst = locations[0]?.slug === props.id
          return (
            <>
              {isFirst && locations.length >= 2 && <LocationNav locations={locations} />}
              <div {...props} className="location-marker flex scroll-mt-24 items-center gap-2">
                <MapPin size={20} strokeWidth={1.75} className="shrink-0 text-marker" />
                <span className="font-display text-xl text-ink dark:text-parchment sm:text-2xl">
                  {children}
                </span>
              </div>
            </>
          )
        }
        if (className === 'review-item') {
          return (
            <div className="review-item-block">
              <ReviewMeta
                subjectTitle={props['data-title']}
                subjectCreator={props['data-creator']}
                subjectYear={props['data-year']}
                rating={props['data-rating'] != null ? parseFloat(props['data-rating']) : null}
                coverSrc={props['data-cover']}
                compact
              />
              <div className="mt-4 space-y-5">{children}</div>
            </div>
          )
        }
        return (
          <div {...props} className={className}>
            {children}
          </div>
        )
      },
      a: ({ href, children, node, ...props }) => {
        const isInPage = href?.startsWith('#')
        return (
          <a
            href={href}
            {...props}
            className="mark-line scroll-mt-24 text-ink dark:text-parchment"
            {...(!isInPage && { target: '_blank', rel: 'noreferrer' })}
          >
            {children}
          </a>
        )
      },
      ul: ({ children }) => <ul className="list-disc space-y-2 pl-5">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal space-y-2 pl-5">{children}</ol>,
      img: ({ src, alt, className }) => {
        const variant = IMG_VARIANTS[className] || DEFAULT_IMG_VARIANT
        if (!variant.figure) {
          return <img src={src} alt={alt || ''} className={variant.img} />
        }
        return (
          <figure className={variant.figure}>
            <img src={src} alt={alt || ''} className={variant.img} />
            {variant.caption && alt && <figcaption className={IMG_CAPTION_CLASS}>{alt}</figcaption>}
          </figure>
        )
      },
      blockquote: ({ children }) =>
        isReview ? (
          <blockquote className="border-l-4 border-marker pl-6 font-serifText text-xl italic leading-snug text-ink dark:text-parchment">
            {children}
          </blockquote>
        ) : (
          <blockquote className="border-l-2 hairline pl-4 italic">{children}</blockquote>
        ),
      h2: ({ children, node, ...props }) =>
        props.id === 'footnote-label' ? (
          <h2 {...props} className="eyebrow scroll-mt-24 mb-4">
            {children}
          </h2>
        ) : (
          <h2 {...props} className="scroll-mt-24">
            {children}
          </h2>
        ),
      h3: ({ children, node, ...props }) => (
        <h3 {...props} className="scroll-mt-24">
          {children}
        </h3>
      ),
      table: ({ children }) => (
        <div className="my-6 overflow-x-auto rounded-xl border hairline">
          <table className="w-full border-collapse text-sm">{children}</table>
        </div>
      ),
      thead: ({ children }) => (
        <thead className="border-b hairline bg-paper-surface dark:bg-night-surface">{children}</thead>
      ),
      th: ({ children }) => (
        <th className="px-3 py-2 text-left font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted dark:text-parchment-muted">
          {children}
        </th>
      ),
      td: ({ children }) => <td className="border-t hairline px-3 py-2 align-top">{children}</td>,
      input: ({ type, checked, node, ...props }) =>
        type === 'checkbox' ? (
          <input
            type="checkbox"
            checked={checked}
            disabled
            className="mr-1.5 accent-marker align-middle"
            {...props}
          />
        ) : (
          <input type={type} {...props} />
        ),
      section: ({ children, node, ...props }) =>
        props['data-footnotes'] !== undefined ? (
          <section
            {...props}
            className="mt-14 border-t hairline pt-6 text-sm text-ink-muted dark:text-parchment-muted"
          >
            {children}
          </section>
        ) : (
          <section {...props}>{children}</section>
        ),
      sup: ({ children, node, ...props }) => (
        <sup {...props} className="scroll-mt-24 text-marker [&_a]:no-underline">
          {children}
        </sup>
      ),
      'citation-ref': ({ id, number }) => (
        <CitationMarker id={id} number={number} entry={bibliography.get(id)} />
      ),
    }
  }, [headings, bibliography, isReview, locations])
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find((p) => p.slug === slug)
  const articleRef = useRef(null)

  const headings = useMemo(() => extractHeadings(post?.body || ''), [post?.body])
  const locations = useMemo(() => extractLocations(post?.body || ''), [post?.body])
  const isDistill = post?.type === 'distill'
  const isReview = post?.type === 'review'
  const bibliography = useMemo(
    () => (isDistill ? extractBibliography(post?.body || '') : new Map()),
    [isDistill, post?.body],
  )
  const citationOrder = useMemo(
    () => (isDistill ? extractCitationOrder(post?.body || '') : new Map()),
    [isDistill, post?.body],
  )
  const markdownComponents = useMarkdownComponents(headings, bibliography, isReview, locations)
  const hasTikz = useMemo(() => /type=["']text\/tikz["']/.test(post?.body || ''), [post?.body])
  const remarkPluginsForPost = useMemo(() => {
    const withHeadingIds = [...remarkPlugins, [remarkHeadingIds, headings]]
    return isDistill ? [...withHeadingIds, [remarkCitations, citationOrder]] : withHeadingIds
  }, [isDistill, headings, citationOrder])
  const rehypePluginsForPost = useMemo(
    () => (locations.length ? [...rehypePlugins, [rehypeLocationIds, locations]] : rehypePlugins),
    [locations],
  )

  if (!post) {
    return (
      <div className="px-6 py-10 sm:py-12">
        <div className="mx-auto max-w-prose text-center">
          <p className="font-display text-2xl text-ink dark:text-parchment">Post not found</p>
          <Link to="/blog" className="mark-line mt-4 inline-block font-mono text-sm text-ink dark:text-parchment">
            ← Back to blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article ref={articleRef} className="px-6 py-10 sm:py-12">
      <ReadingProgress target={articleRef} />
      <TikZLoader active={hasTikz} />
      <div className="mx-auto max-w-prose">
        <Reveal>
          <Link
            to="/blog"
            className="mark-line inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted dark:text-parchment-muted"
          >
            <ArrowLeft size={13} strokeWidth={1.75} />
            All posts
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-faint dark:text-parchment-faint">
              {formatDate(post.date)}
              {post.readTime && ` · ${post.readTime}`}
            </p>
            {post.status === 'draft' && <DraftBadge />}
          </div>
          <CategoryTags
            category={post.category}
            subcategories={post.subcategories}
            tags={post.tags}
            className="mt-3"
          />
          <h1 className="mt-3 font-display text-4xl leading-tight text-ink dark:text-parchment sm:text-5xl">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="mt-4 font-serifText text-lg italic leading-snug text-ink-muted dark:text-parchment-muted sm:text-xl">
              {post.subtitle}
            </p>
          )}
        </Reveal>
      </div>

      <div className="mx-auto max-w-prose">
        {post.cover && (
          <Reveal delay={0.06} className="relative mt-10">
            {post.featured && (
              <FeaturedBadge size="md" className="absolute left-3 top-3 z-10" />
            )}
            <img
              src={post.cover}
              alt=""
              className="h-auto w-full rounded-2xl border hairline"
            />
          </Reveal>
        )}

        {post.type === 'travel' && post.gallery?.length > 0 && (
          <Reveal delay={0.08} className="mt-8">
            <PostGallery gallery={post.gallery} />
          </Reveal>
        )}

        {isReview && (
          <Reveal delay={0.08} className="mt-8">
            <ReviewMeta
              subjectTitle={post.subjectTitle}
              subjectCreator={post.subjectCreator}
              subjectYear={post.subjectYear}
              rating={post.rating}
              mediaType={post.mediaType}
            />
          </Reveal>
        )}
      </div>

      {isDistill ? (
        <div className="mt-10 lg:grid lg:grid-cols-[minmax(1.5rem,1fr)_min(42rem,100%)_minmax(1.5rem,1fr)] lg:items-start lg:gap-x-8">
          <div className="hidden lg:flex lg:justify-end">
            <TocDesktopNav headings={headings} />
          </div>
          <div className="mx-auto w-full max-w-prose lg:mx-0 lg:max-w-none">
            <TocMobileDetails headings={headings} />
            <Reveal
              delay={0.1}
              className="prose-content is-distill space-y-5 text-[1.05rem] leading-relaxed text-ink-muted dark:text-parchment-muted"
            >
              <ReactMarkdown
                remarkPlugins={remarkPluginsForPost}
                rehypePlugins={rehypePluginsForPost}
                components={markdownComponents}
              >
                {post.body}
              </ReactMarkdown>
            </Reveal>
            <References bibliography={bibliography} citationOrder={citationOrder} />
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-prose">
          <Reveal delay={0.1} className="prose-content mt-10 space-y-5 text-[1.05rem] leading-relaxed text-ink-muted dark:text-parchment-muted">
            <ReactMarkdown
              remarkPlugins={remarkPluginsForPost}
              rehypePlugins={rehypePluginsForPost}
              components={markdownComponents}
            >
              {post.body}
            </ReactMarkdown>
          </Reveal>
        </div>
      )}
    </article>
  )
}
