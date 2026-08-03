import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

// Custom listbox replacing native <select> so the open options list can be
// styled with the site's own tokens (paper/night surfaces, hairline border,
// marker accent) — a native <select>'s open list is rendered by the OS and
// is outside CSS's reach in any reliable cross-browser way.
export default function Dropdown({
  value,
  options,
  onChange,
  disabled = false,
  uppercase = true,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef(null)
  const buttonRef = useRef(null)
  const optionRefs = useRef([])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const idx = Math.max(0, options.indexOf(value))
    setActiveIndex(idx)
    requestAnimationFrame(() => optionRefs.current[idx]?.focus())
  }, [open, options, value])

  function selectOption(opt) {
    onChange(opt)
    setOpen(false)
    buttonRef.current?.focus()
  }

  function handleButtonKeyDown(e) {
    if (disabled) return
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(true)
    }
  }

  function handleListKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(activeIndex + 1, options.length - 1)
      setActiveIndex(next)
      optionRefs.current[next]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = Math.max(activeIndex - 1, 0)
      setActiveIndex(prev)
      optionRefs.current[prev]?.focus()
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      selectOption(options[activeIndex])
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  const textTransform = uppercase ? 'uppercase' : 'normal-case'

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        ref={buttonRef}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-lg border hairline bg-transparent px-3 py-2 font-mono text-[12px] ${textTransform} tracking-[0.08em] text-ink transition-colors hover:border-marker focus:border-marker focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-parchment`}
      >
        <span>{value}</span>
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          className={`text-ink-faint transition-transform dark:text-parchment-faint ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          onKeyDown={handleListKeyDown}
          className="absolute left-0 top-full z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border hairline bg-paper-surface py-1 shadow-lg dark:bg-night-surface"
        >
          {options.map((opt, i) => {
            const selected = opt === value
            return (
              <li
                key={opt}
                ref={(el) => (optionRefs.current[i] = el)}
                role="option"
                aria-selected={selected}
                tabIndex={-1}
                onClick={() => selectOption(opt)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`cursor-pointer px-3 py-2 font-mono text-[12px] ${textTransform} tracking-[0.08em] outline-none transition-colors ${
                  selected ? 'text-marker' : 'text-ink dark:text-parchment'
                } ${activeIndex === i ? 'bg-marker/10' : ''}`}
              >
                {opt}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
