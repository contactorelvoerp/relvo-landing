import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { languageDecision } from './shared/language.js'

// Producción (indexable, sin páginas pendientes) solo cuando Vercel lo dice.
const production = process.env.VERCEL_ENV === 'production'

// Mismo destino que los rewrites de /blog en vercel.json, también en dev y preview.
const blogProxy = {
  '^/blog(?:/|\\?|$)': { target: process.env.BLOG_ORIGIN || 'https://relvo-blog.vercel.app', changeOrigin: true },
}
const isBlogPath = (url) => /^\/blog(?:\/|$)/.test(url)

// sitemap.xml, robots.txt y llms.txt en desarrollo: los mismos de src/seo/files.js que escribe el build.
const TECH_FILES = {
  '/sitemap.xml': { type: 'application/xml; charset=utf-8', body: (ssr) => ssr.sitemapXml() },
  '/robots.txt': { type: 'text/plain; charset=utf-8', body: (ssr) => ssr.robotsTxt(production) },
  '/llms.txt': { type: 'text/plain; charset=utf-8', body: (ssr) => ssr.llmsTxt() },
}

// Mirror Vercel language routing locally, including cookie overrides and geo-header tests.
function localLanguageRouting(req, res, next) {
  const request = new Request(new URL(req.url, `http://${req.headers.host}`), { method: req.method, headers: req.headers })
  const decision = languageDecision(request)
  if (decision?.cookie) res.setHeader('Set-Cookie', decision.cookie)
  if (decision?.location || decision?.cookie) res.setHeader('Cache-Control', 'private, no-store')
  if (!decision?.location) return next()
  res.writeHead(307, { Location: decision.location })
  res.end()
}

// En `npm run dev` cada página se renderiza en el servidor con su <head> de SEO,
// igual que en el build estático: lo que se revisa en localhost es lo que se publica.
function devServerRender() {
  return {
    name: 'relvo-dev-server-render',
    configureServer(server) {
      server.middlewares.use(localLanguageRouting)
      server.middlewares.use(async (req, res, next) => {
        // Responde igual sin importar el header Accept (curl y los crawlers mandan */* o nada)
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()
        const url = req.originalUrl.split('?')[0]
        if (isBlogPath(url)) return next()
        const file = TECH_FILES[url]
        // Solo rutas de página (sin extensión) y los archivos técnicos; assets y módulos de Vite siguen su curso
        if (!file && (path.extname(url) || url.startsWith('/@') || url.startsWith('/node_modules/'))) return next()
        try {
          const ssr = await server.ssrLoadModule('/src/entry-server.jsx')
          if (file) {
            res.setHeader('Content-Type', file.type)
            return res.end(req.method === 'HEAD' ? undefined : file.body(ssr))
          }
          const template = await server.transformIndexHtml(url, fs.readFileSync(path.resolve('index.html'), 'utf8'))
          const route = ssr.resolvePath(url)
          res.statusCode = route.status === '404' ? 404 : 200
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          const og = `/og/${route.id}-${route.locale}.png`
          res.end(req.method === 'HEAD' ? undefined : ssr.renderDocument(template, route, { production: false, ogImage: fs.existsSync(path.resolve(`public${og}`)) ? og : null }))
        } catch (error) {
          server.ssrFixStacktrace(error)
          next(error)
        }
      })
    },
    // Preview: URLs sin barra final (/en, /agendar-demo) como en Vercel (cleanUrls) y 404.html para
    // las rutas que no existen.
    configurePreviewServer(server) {
      server.middlewares.use(localLanguageRouting)
      server.middlewares.use((req, res, next) => {
        const url = req.url.split('?')[0]
        if (isBlogPath(url)) return next()
        const page = url === '/' || fs.existsSync(path.resolve('dist', `.${url}`, 'index.html'))
        if (!path.extname(url) && url !== '/' && page) req.url = `${url}/`
        // Como Vercel: una ruta de página sin HTML responde 404 con dist/404.html
        if (!path.extname(url) && !page) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          return res.end(fs.readFileSync(path.resolve('dist/404.html')))
        }
        next()
      })
    },
  }
}

// Dev: el HTML lo arma devServerRender. Preview: sirve dist/ como sitio estático (index.html por carpeta).
export default defineConfig(({ isPreview }) => ({
  appType: isPreview ? 'mpa' : 'custom',
  plugins: [react(), devServerRender()],
  // Keep the compact stylesheet inline in prerendered HTML. JavaScript is split
  // by page, while CSS paints immediately without waiting for a lazy chunk.
  build: { manifest: true, cssCodeSplit: false },
  define: {
    __SHOW_PENDING__: JSON.stringify(!production),
  },
  server: {
    port: 3000,
    proxy: blogProxy,
  },
  preview: { proxy: blogProxy },
}))
