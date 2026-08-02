import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme.jsx'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border hairline text-ink dark:text-parchment transition-colors hover:border-marker"
    >
      <Sun
        size={16}
        strokeWidth={1.75}
        className={`absolute transition-all duration-300 ${isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
      />
      <Moon
        size={16}
        strokeWidth={1.75}
        className={`absolute transition-all duration-300 ${isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`}
      />
    </button>
  )
}
