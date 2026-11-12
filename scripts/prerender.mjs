// Genera el sitio estático: un HTML por ruta con su <head> de SEO, más 404,
// sitemap.xml, robots.txt y llms.txt (src/seo/files.js, los mismos que sirve `npm run dev`). Corre después de `vite build` (cliente y SSR).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { PAGE_DEFINITIONS, PAGE_MODULES } from '../src/pages/manifest.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const production = process.env.VERCEL_ENV === 'production'
const { getRoutes, notFoundRoute, renderDocument, sitemapXml, robotsTxt, llmsTxt } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
)

const ROUTES = getRoutes()
const manifest = JSON.parse(fs.readFileSync(path.join(dist, '.vite/manifest.json'), 'utf8'))
const inlineStyles = new Set(manifest['index.html']?.css ?? [])

// Resolve CSS and shared imports before rendering: a lazy page must be styled
// on the first paint, and its JavaScript should download alongside the shell.
function pageAssets(route) {
  const entry = PAGE_MODULES[PAGE_DEFINITIONS[route.id]?.kind]
  if (!entry || route.status !== 'live') return ''
  const scripts = new Set(), styles = new Set(), visited = new Set()
  const collect = (key) => {
    if (visited.has(key)) return
    visited.add(key)
    const chunk = manifest[key]
    if (!chunk) throw new Error(`Missing page asset: ${key}`)
    scripts.add(chunk.file)
    chunk.css?.forEach((file) => { if (!inlineStyles.has(file)) styles.add(file) })
    chunk.imports?.forEach(collect)
  }
  collect(entry.file)
  return [
    ...[...styles].map((file) => `<link rel="stylesheet" crossorigin href="/${file}" />`),
    ...[...scripts].map((file) => `<link rel="modulepreload" crossorigin href="/${file}" />`),
  ].join('\n    ')
}

// El CSS del shell va inline: evita una petición que bloquea el primer render.
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8').replace(
  /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/,
  (_, href) => `<style>${fs.readFileSync(path.join(dist, href), 'utf8')}</style>`,
)
fs.rmSync(path.join(dist, 'index.html'))

function page(route) {
  const ogFile = `/og/${route.id}-${route.locale}.png`
  const ogImage = fs.existsSync(path.join(dist, ogFile)) ? ogFile : null
  const styled = template.replace('<!--app-head-->', `<!--app-head-->\n    ${pageAssets(route)}`)
  return renderDocument(styled, route, { production, ogImage })
}

function write(file, content) {
  const target = path.join(dist, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, content)
}

for (const route of ROUTES) {
  write(route.path === '/' ? 'index.html' : `${route.path.slice(1)}/index.html`, page(route))
}
write('404.html', page(notFoundRoute()))

const live = ROUTES.filter((r) => r.status === 'live')
write('sitemap.xml', sitemapXml())
write('robots.txt', robotsTxt(production))
write('llms.txt', llmsTxt())

fs.rmSync(ssrDir, { recursive: true })

const pending = ROUTES.length - live.length
console.log(`prerender: ${live.length} páginas publicadas, ${pending} pendientes (${production ? 'producción' : 'preview, noindex'}), 404.html`)
