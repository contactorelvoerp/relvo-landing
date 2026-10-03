import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Producción (indexable, sin páginas pendientes) solo cuando Vercel lo dice.
const production = process.env.VERCEL_ENV === 'production'

// En `npm run dev` cada página se renderiza en el servidor con su <head> de SEO,
// igual que en el build estático: lo que se revisa en localhost es lo que se publica.
function devServerRender() {
  return {
    name: 'relvo-dev-server-render',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET' || !req.headers.accept?.includes('text/html')) return next()
        try {
          const url = req.originalUrl.split('?')[0]
          const template = await server.transformIndexHtml(url, fs.readFileSync(path.resolve('index.html'), 'utf8'))
          const { renderDocument, resolvePath } = await server.ssrLoadModule('/src/entry-server.jsx')
          const route = resolvePath(url)
          res.statusCode = route.status === '404' ? 404 : 200
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(renderDocument(template, route, { production: false, ogImage: fs.existsSync(path.resolve(`public/og/${route.id}-${route.locale}.png`)) ? `/og/${route.id}-${route.locale}.png` : null }))
        } catch (error) {
          server.ssrFixStacktrace(error)
          next(error)
        }
      })
    },
    // Preview: URLs sin barra final (/en, /agendar-demo) como en Vercel (cleanUrls).
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url.split('?')[0]
        if (!path.extname(url) && url !== '/' && fs.existsSync(path.resolve('dist', `.${url}`, 'index.html'))) req.url = `${url}/`
        next()
      })
    },
  }
}

// Dev: el HTML lo arma devServerRender. Preview: sirve dist/ como sitio estático (index.html por carpeta).
export default defineConfig(({ isPreview }) => ({
  appType: isPreview ? 'mpa' : 'custom',
  plugins: [react(), devServerRender()],
  define: {
    __SHOW_PENDING__: JSON.stringify(!production),
  },
  server: {
    port: 3000,
  },
}))
