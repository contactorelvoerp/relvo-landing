import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { getRoutes } from '../routes'
import { absoluteUrl } from './head'
import { SITE_NAME, SITE_URL } from '../site'

// sitemap.xml, robots.txt y llms.txt (CLAUDE.md, SEO). Los usan el build estático
// (scripts/prerender.mjs) y el servidor de desarrollo, así ambos sirven lo mismo.

// Páginas que van al sitemap y a llms.txt: las publicadas.
const sitemapRoutes = () => getRoutes().filter((r) => r.status === 'live')

// lastmod real: fecha del último commit que tocó la página (en las de plantilla, su archivo de
// contenido). Sin git (p. ej. un tarball) se usa la fecha de hoy.
function lastmod(route) {
  const content = `content/${route.locale}${route.path}.json`
  const source = fs.existsSync(content) ? content : `src/pages/${route.id}`
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', source], { encoding: 'utf8' }).trim()
    if (date) return date
  } catch { /* sin git */ }
  return new Date().toISOString().slice(0, 10)
}

export function sitemapXml() {
  const urls = sitemapRoutes()
    .map((r) => `  <url><loc>${absoluteUrl(r.path)}</loc><lastmod>${lastmod(r)}</lastmod></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

// Producción permite todo (incluidos los crawlers de IA) y apunta al sitemap; los previews no se indexan.
export function robotsTxt(production) {
  return production
    ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n'
}

// Se arma con los titles y descriptions aprobados de cada página publicada.
export function llmsTxt() {
  const live = sitemapRoutes()
  const home = live.find((r) => r.id === 'home' && r.locale === 'es')
  const lines = [
    `# ${SITE_NAME}`,
    ...(home ? ['', `> ${home.description}`] : []),
    '',
    ...live.filter((r) => r.id !== 'home').map((r) => `- [${r.title}](${absoluteUrl(r.path)}): ${r.description}`),
  ]
  return `${lines.join('\n')}\n`
}
