/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#13131E',
        'ink-soft': 'rgba(19, 19, 30, 0.68)',
        'muted-aa': '#5D5D6B',
        'muted-deco': '#ABABB7',
        'gray-brand': '#E8E8E8',
        lime: { brand: '#D0FF0B', tint: '#D5F7C1' },
        mint: { brand: '#72DDAA', tint: '#DFF4EB' },
        purple: { brand: '#633BF2', night: '#3F28B2' },
        salmon: { brand: '#FF9566' },
        lilac: { brand: '#E3C0F2' },
        ochre: { brand: '#B8D12A' },
        'green-deep': '#186666',
      },
      fontFamily: {
        display: ['Fujiwara A', 'Instrument Sans', 'system-ui', 'sans-serif'],
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
        'telegraf': ['Telegraf', 'Inter', 'sans-serif'],
        'geist': ['Geist', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      maxWidth: {
        content: '1160px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
        'drift': 'v2-drift 90s linear infinite',
        'drift-slow': 'v2-drift 150s linear infinite',
        'flow': 'v2-flow 1.2s linear infinite',
        'pulse-soft': 'v2-pulse 2.4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
