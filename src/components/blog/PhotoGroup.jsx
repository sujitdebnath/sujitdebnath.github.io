import { useState } from 'react'
import Lightbox from './Lightbox.jsx'
import TileGrid from './TileGrid.jsx'

// Fixed 4 columns, same as the main travel gallery — deliberately not
// reduced based on image count. Column count needs to match how many
// column-tracks the tiles' *sizes* actually need, not a raw tag count:
// a `large`/`wide` tile alone already consumes 2 of however many
// columns exist, so a naive count-based grid (e.g. 3 images -> 3
// columns) can leave a later tile with nowhere to fit on its row and
// force it to drop alone — the bug this fixed-width version avoids. A
// group with fewer photos than 4 just leaves some cells on its last row
// empty, which the fixed-row-height grid already handles cleanly.
const COLUMNS_CLASS = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'

export default function PhotoGroup({ photos }) {
  const [activeIndex, setActiveIndex] = useState(null)

  if (!photos?.length) return null

  return (
    <div className="photo-group-block">
      <TileGrid photos={photos} columnsClassName={COLUMNS_CLASS} onSelect={setActiveIndex} />
      <Lightbox
        gallery={photos}
        activeIndex={activeIndex}
        onNavigate={setActiveIndex}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  )
}
