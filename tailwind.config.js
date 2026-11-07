/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#140D0A',
          surface: '#241612',
          border: '#38220F',
          muted: '#CFB28C',
          primary: '#D28A4C',
          accent: '#E89B55',
        }
      },
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        display: ['"Space Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      }
    },
  },
  plugins: [],
}
