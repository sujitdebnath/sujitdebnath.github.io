import { Star } from 'lucide-react'

const emptyStarClass = 'text-ink-faint dark:text-parchment-faint'
const filledStarClass = 'fill-marker text-marker'

function StarIcon({ state, size }) {
  if (state === 'full') {
    return <Star size={size} strokeWidth={1.75} className={filledStarClass} />
  }
  if (state === 'empty') {
    return <Star size={size} strokeWidth={1.75} className={emptyStarClass} />
  }
  // Half-fill: an empty base star with a second, filled star layered on
  // top and clipped to 50% width — Star has no built-in half-fill variant.
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      <Star size={size} strokeWidth={1.75} className={`absolute inset-0 ${emptyStarClass}`} />
      <span className="absolute inset-0 w-1/2 overflow-hidden">
        <Star size={size} strokeWidth={1.75} className={filledStarClass} />
      </span>
    </span>
  )
}

// Add a case here when a new mediaType needs its own creator-label wording —
// no new post type needed, just wire up the label.
function creatorLabel(subjectCreator, mediaType) {
  if (mediaType === 'movie') return `Directed by ${subjectCreator}`
  return subjectCreator
}

export default function ReviewMeta({
  subjectTitle,
  subjectCreator,
  subjectYear,
  rating,
  mediaType,
  coverSrc,
  compact = false,
}) {
  if (!subjectTitle && !subjectCreator && rating == null) return null

  const starSize = compact ? 13 : 16
  const meta = (
    <>
      {(subjectTitle || subjectCreator) && (
        <div>
          {subjectTitle && (
            <p className={`font-display text-ink dark:text-parchment ${compact ? 'text-base' : 'text-lg'}`}>
              {subjectTitle}
              {subjectYear && (
                <span className="text-ink-muted dark:text-parchment-muted"> ({subjectYear})</span>
              )}
            </p>
          )}
          {subjectCreator && (
            <p className="mt-1 text-sm text-ink-muted dark:text-parchment-muted">
              {creatorLabel(subjectCreator, mediaType)}
            </p>
          )}
        </div>
      )}
      {rating != null && (
        <div
          className={`flex items-center gap-1 ${compact ? 'mt-2' : 'mt-3'}`}
          aria-label={`Rating: ${rating} out of 5`}
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const state = rating >= n ? 'full' : rating >= n - 0.5 ? 'half' : 'empty'
            return <StarIcon key={n} state={state} size={starSize} />
          })}
          <span className="ml-1.5 font-mono text-[12px] text-ink-muted dark:text-parchment-muted">
            {rating}/5
          </span>
        </div>
      )}
    </>
  )

  if (compact) {
    return (
      <div className="flex items-center gap-4 rounded-xl border hairline p-4">
        {coverSrc && (
          <img
            src={coverSrc}
            alt=""
            className="h-16 w-16 shrink-0 rounded-lg border hairline object-cover sm:h-20 sm:w-20"
          />
        )}
        <div className="min-w-0 flex-1">{meta}</div>
      </div>
    )
  }

  return <div className="rounded-2xl border hairline p-6">{meta}</div>
}
