import { useState } from 'react'
import Lightbox from './Lightbox.jsx'

const SIZE_CLASSES = {
  large: 'col-span-2 row-span-2',
  tall: 'row-span-2',
  normal: '',
}

export default function PostGallery({ gallery }) {
  const [activeIndex, setActiveIndex] = useState(null)

  if (!gallery?.length) return null

  return (
    <>
      <p className="eyebrow mb-3">Gallery</p>
      <div className="grid grid-flow-dense grid-cols-2 auto-rows-[7rem] gap-2 sm:grid-cols-3 sm:auto-rows-[10rem] lg:grid-cols-4">
        {gallery.map((photo, i) => (
          <button
            key={photo.src + i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`group relative h-full w-full overflow-hidden rounded-xl border hairline ${
              SIZE_CLASSES[photo.size] || SIZE_CLASSES.normal
            }`}
          >
            <img
              src={photo.src}
              alt={photo.caption || ''}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      <Lightbox
        gallery={gallery}
        activeIndex={activeIndex}
        onNavigate={setActiveIndex}
        onClose={() => setActiveIndex(null)}
      />
    </>
  )
}
