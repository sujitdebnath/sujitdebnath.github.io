import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Lightbox({ gallery, activeIndex, onNavigate, onClose }) {
  const count = gallery?.length || 0
  const photo = activeIndex != null ? gallery[activeIndex] : null

  useEffect(() => {
    if (photo == null) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onNavigate((activeIndex - 1 + count) % count)
      if (e.key === 'ArrowRight') onNavigate((activeIndex + 1) % count)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [photo, activeIndex, count, onNavigate, onClose])

  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-night/95 p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 rounded-full border hairline p-2 text-parchment hover:border-marker hover:text-marker"
      >
        <X size={18} strokeWidth={1.75} />
      </button>

      {count > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNavigate((activeIndex - 1 + count) % count)
          }}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border hairline p-2 text-parchment hover:border-marker hover:text-marker sm:left-5"
        >
          <ChevronLeft size={20} strokeWidth={1.75} />
        </button>
      )}

      <img
        src={photo.src}
        alt={photo.caption || ''}
        className="max-h-[80vh] max-w-full rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {count > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNavigate((activeIndex + 1) % count)
          }}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border hairline p-2 text-parchment hover:border-marker hover:text-marker sm:right-5"
        >
          <ChevronRight size={20} strokeWidth={1.75} />
        </button>
      )}

      {photo.caption && (
        <p className="mt-4 max-w-prose text-center font-mono text-[12px] text-parchment-muted">
          {photo.caption}
        </p>
      )}
    </div>
  )
}
