// Shared Pinterest-style mixed-grid technique (round 21): fixed row
// height + per-tile row/col spans + object-cover, no per-tile
// aspect-ratio. Used by both the frontmatter-driven travel gallery
// (PostGallery) and inline in-body photo groups (PhotoGroup) so the two
// don't drift into separate grid implementations.
export const TILE_SIZE_CLASSES = {
  large: 'col-span-2 row-span-2',
  tall: 'row-span-2',
  wide: 'col-span-2',
  normal: '',
}

export default function TileGrid({ photos, columnsClassName, onSelect }) {
  return (
    <div
      className={`grid grid-flow-dense auto-rows-[7rem] gap-2 sm:auto-rows-[10rem] ${columnsClassName}`}
    >
      {photos.map((photo, i) => (
        <button
          key={photo.src + i}
          type="button"
          onClick={() => onSelect(i)}
          className={`group relative h-full w-full overflow-hidden rounded-xl border hairline ${
            TILE_SIZE_CLASSES[photo.size] || TILE_SIZE_CLASSES.normal
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
  )
}
