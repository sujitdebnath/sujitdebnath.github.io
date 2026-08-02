/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FAFAF9', // light bg
          surface: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#17181A', // light primary text
          muted: '#5A5E61',   // light secondary text
          faint: '#8B8E90',
        },
        line: {
          DEFAULT: '#E4E3DE', // light hairline
        },
        night: {
          DEFAULT: '#121314', // dark bg
          surface: '#1A1B1D',
        },
        parchment: {
          DEFAULT: '#F1EFE8', // dark primary text
          muted: '#9A9D9F',   // dark secondary text
          faint: '#6E7072',
        },
        seam: {
          DEFAULT: '#2B2C2E', // dark hairline
        },
        marker: {
          DEFAULT: '#F5C518', // signature accent — highlighter yellow
          soft: '#F5C51833',
          ink: '#17181A',     // text color when sitting on the accent
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        serifText: ['"Source Serif 4"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        prose: '42rem',
        content: '68rem',
      },
      keyframes: {
        marker: {
          '0%': { backgroundSize: '0% 100%' },
          '100%': { backgroundSize: '100% 100%' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
      animation: {
        marker: 'marker 0.5s ease-out forwards',
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
}
