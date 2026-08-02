import { Star } from 'lucide-react'

const emptyStarClass = 'text-ink-faint dark:text-parchment-faint'
const filledStarClass = 'fill-marker text-marker'

function StarIcon({ state }) {
  if (state === 'full') {
    return <Star size={16} strokeWidth={1.75} className={filledStarClass} />
  }
  if (state === 'empty') {
    return <Star size={16} strokeWidth={1.75} className={emptyStarClass} />
  }
  // Half-fill: an empty base star with a second, filled star layered on
  // top and clipped to 50% width — Star has no built-in half-fill variant.
  return (
    <span className="relative inline-block h-4 w-4 shrink-0">
      <Star size={16} strokeWidth={1.75} className={`absolute inset-0 ${emptyStarClass}`} />
      <span className="absolute inset-0 w-1/2 overflow-hidden">
        <Star size={16} strokeWidth={1.75} className={filledStarClass} />
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

export default function ReviewMeta({ subjectTitle, subjectCreator, subjectYear, rating, mediaType }) {
  if (!subjectTitle && !subjectCreator && rating == null) return null

  return (
    <div className="rounded-2xl border hairline p-6">
      {(subjectTitle || subjectCreator) && (
        <div>
          {subjectTitle && (
            <p className="font-display text-lg text-ink dark:text-parchment">
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
          className="mt-3 flex items-center gap-1"
          aria-label={`Rating: ${rating} out of 5`}
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const state = rating >= n ? 'full' : rating >= n - 0.5 ? 'half' : 'empty'
            return <StarIcon key={n} state={state} />
          })}
          <span className="ml-1.5 font-mono text-[12px] text-ink-muted dark:text-parchment-muted">
            {rating}/5
          </span>
        </div>
      )}
    </div>
  )
}
