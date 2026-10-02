import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Producción (indexable, sin páginas pendientes) solo cuando Vercel lo dice.
const production = process.env.VERCEL_ENV === 'production'

export default defineConfig({
  plugins: [react()],
  define: {
    __SHOW_PENDING__: JSON.stringify(!production),
  },
  server: {
    port: 3000,
  },
})
