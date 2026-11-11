import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import seo from '../../reference/seo-metadata.json'
import { getRoutes } from '../routes'
import { absoluteUrl } from './head'
import { API_DOCS_URL, SITE_NAME, SITE_URL } from '../site'

// sitemap.xml, robots.txt y llms.txt (CLAUDE.md, SEO). Los usan el build estático
// (scripts/prerender.mjs) y el servidor de desarrollo, así ambos sirven lo mismo.

// Páginas que van al sitemap y a llms.txt: las publicadas e indexables.
const sitemapRoutes = () => getRoutes().filter((r) => r.status === 'live' && !r.noindex)

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

// Producción permite todo (incluidos los crawlers de IA) y apunta a los sitemaps (el del blog lo genera
// relvo-blog); los previews no se indexan.
export function robotsTxt(production) {
  return production
    ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\nSitemap: ${SITE_URL}/blog/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n'
}

// El blog (relvo-blog) no es una ruta de este sitio, pero sí una página clave
const blog = seo.pages.find((p) => p.id === 'blog').es

// Para agentes que integran Relvo (no solo los que lo evalúan): la documentación, la referencia y el
// servidor MCP viven en la app. Son destinos, no copy de marketing; el detalle está en su propio llms.txt.
const APP_ORIGIN = new URL(API_DOCS_URL).origin
const DEVELOPER_LINKS = [
  ['Documentación de producto', `${APP_ORIGIN}/docs/product/es/overview/`, 'guías de integración, conceptos y flujos (también en inglés: /docs/product/en/overview/).'],
  ['Referencia de la API', API_DOCS_URL, 'cada endpoint público con ejemplos de request.'],
  ['OpenAPI', `${APP_ORIGIN}/public-openapi.json`, 'especificación de la API pública, para generar clientes.'],
  ['Servidor MCP', `${APP_ORIGIN}/docs/product/guides/mcp/`, 'cómo conectar un agente de IA a Relvo.'],
  ['Seguridad y confianza', `${APP_ORIGIN}/docs/product/es/security/`, 'alojamiento, aislamiento, acceso, respaldos y reporte de vulnerabilidades.'],
  ['llms.txt de la plataforma', `${APP_ORIGIN}/llms.txt`, 'índice para agentes de la documentación técnica.'],
  ['llms-full.txt', `${APP_ORIGIN}/llms-full.txt`, 'la documentación técnica completa en un solo archivo.'],
]

// Se arma con los titles y descriptions aprobados de cada página publicada.
export function llmsTxt() {
  const live = sitemapRoutes()
  const home = live.find((r) => r.id === 'home' && r.locale === 'es')
  const lines = [
    `# ${SITE_NAME}`,
    ...(home ? ['', `> ${home.description}`] : []),
    '',
    ...live.filter((r) => r.id !== 'home').map((r) => `- [${r.title}](${absoluteUrl(r.path)}): ${r.description}`),
    `- [${blog.title}](${absoluteUrl(blog.url)}): ${blog.description}`,
    '',
    '## Desarrolladores y agentes',
    '',
    ...DEVELOPER_LINKS.map(([name, url, what]) => `- [${name}](${url}): ${what}`),
  ]
  return `${lines.join('\n')}\n`
}
