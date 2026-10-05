// Genera el sitio estático: un HTML por ruta con su <head> de SEO, más 404,
// sitemap.xml, robots.txt y llms.txt. Corre después de `vite build` (cliente y SSR).
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const production = process.env.VERCEL_ENV === 'production'
const { getRoutes, SITE_NAME, SITE_URL, absoluteUrl, notFoundRoute, renderDocument } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
)

const ROUTES = getRoutes()

// El CSS (~8 KB comprimido) va inline: evita una petición que bloquea el primer render.
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8').replace(
  /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/,
  (_, href) => `<style>${fs.readFileSync(path.join(dist, href), 'utf8')}</style>`,
)
fs.rmSync(path.join(dist, 'index.html'))

function page(route) {
  const ogFile = `/og/${route.id}-${route.locale}.png`
  const ogImage = fs.existsSync(path.join(dist, ogFile)) ? ogFile : null
  return renderDocument(template, route, { production, ogImage })
}

function write(file, content) {
  const target = path.join(dist, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, content)
}

// lastmod real: fecha del último commit que tocó la página.
function lastmod(route) {
  const source = `src/pages/${route.id}`
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', source], { cwd: root, encoding: 'utf8' }).trim()
    if (date) return date
  } catch { /* sin git (p. ej. tarball): se usa la fecha del build */ }
  return new Date().toISOString().slice(0, 10)
}

for (const route of ROUTES) {
  write(route.path === '/' ? 'index.html' : `${route.path.slice(1)}/index.html`, page(route))
}
write('404.html', page(notFoundRoute()))

const live = ROUTES.filter((r) => r.status === 'live')

const urls = live
  .map((r) => `  <url><loc>${absoluteUrl(r.path)}</loc><lastmod>${lastmod(r)}</lastmod></url>`)
  .join('\n')
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)

write('robots.txt', production
  ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
  : 'User-agent: *\nDisallow: /\n')

// llms.txt se arma con los titles y descriptions aprobados de cada página publicada.
const home = live.find((r) => r.id === 'home' && r.locale === 'es')
const llms = [
  `# ${SITE_NAME}`,
  ...(home ? ['', `> ${home.description}`] : []),
  '',
  ...live.filter((r) => r.id !== 'home').map((r) => `- [${r.title}](${absoluteUrl(r.path)}): ${r.description}`),
]
write('llms.txt', `${llms.join('\n')}\n`)

fs.rmSync(ssrDir, { recursive: true })

const pending = ROUTES.length - live.length
console.log(`prerender: ${live.length} páginas publicadas, ${pending} pendientes (${production ? 'producción' : 'preview, noindex'}), 404.html`)
