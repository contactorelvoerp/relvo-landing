import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import seo from '../../reference/seo-metadata.json'
import { getRoutes } from '../routes'
import { absoluteUrl } from './head'
import { SITE_NAME, SITE_URL } from '../site'

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

// La documentación de producto y de la API vive en la app (relvo, docs-site), que publica su propio
// llms.txt con una copia en Markdown de cada página. Este sitio solo la enlaza: así un agente que
// llega por getrelvo.ai encuentra cómo funciona e integra Relvo sin que el contenido se duplique.
const DOCS_ORIGIN = 'https://app.relvoerp.com'
const docsLinks = [
  ['Documentación de Relvo para agentes', `${DOCS_ORIGIN}/llms.txt`, 'Índice de la documentación de producto e integración, con cuándo Relvo encaja, cuándo no, y un quickstart de la API.'],
  ['Documentación completa en un archivo', `${DOCS_ORIGIN}/llms-full.txt`, 'Todas las páginas de la documentación en Markdown, en orden de lectura.'],
  ['API pública (OpenAPI)', `${DOCS_ORIGIN}/public-openapi.json`, 'Contrato de la API REST: clientes, contratos, uso, facturas y webhooks.'],
]

// Se arma con los titles y descriptions aprobados de cada página publicada, en el formato de
// llmstxt.org: H1, resumen y secciones H2 con listas de enlaces.
export function llmsTxt() {
  const live = sitemapRoutes()
  const home = live.find((r) => r.id === 'home' && r.locale === 'es')
  const lines = [
    `# ${SITE_NAME}`,
    ...(home ? ['', `> ${home.description}`] : []),
    '',
    '## Sitio',
    '',
    ...live.filter((r) => r.id !== 'home').map((r) => `- [${r.title}](${absoluteUrl(r.path)}): ${r.description}`),
    `- [${blog.title}](${absoluteUrl(blog.url)}): ${blog.description}`,
    '',
    '## Documentación',
    '',
    ...docsLinks.map(([title, url, description]) => `- [${title}](${url}): ${description}`),
  ]
  return `${lines.join('\n')}\n`
}
