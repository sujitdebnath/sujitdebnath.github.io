import { useState } from 'react'
import Lightbox from './Lightbox.jsx'
import TileGrid from './TileGrid.jsx'

export default function PostGallery({ gallery }) {
  const [activeIndex, setActiveIndex] = useState(null)

  if (!gallery?.length) return null

  return (
    <>
      <p className="eyebrow mb-3">Gallery</p>
      <TileGrid
        photos={gallery}
        columnsClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        onSelect={setActiveIndex}
      />
      <Lightbox
        gallery={gallery}
        activeIndex={activeIndex}
        onNavigate={setActiveIndex}
        onClose={() => setActiveIndex(null)}
      />
    </>
  )
}
