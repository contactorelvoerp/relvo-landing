// Pide al servidor, sin headers especiales (como curl o un crawler), cada URL del sitemap y los
// archivos técnicos: todo debe responder 200. Una ruta inexistente debe responder 404. Las páginas en
// preparación (src/pages/noindex.js) responden 200 con noindex y no están en el sitemap, y las rutas
// en inglés sin traducción (fuera del sitemap) responden 404.
// Uso: node scripts/check-routes.mjs [base]   (base por defecto: http://localhost:4317)
import fs from 'node:fs'
import { NOINDEX_PAGES } from '../src/pages/noindex.js'

const seo = JSON.parse(fs.readFileSync(new URL('../reference/seo-metadata.json', import.meta.url), 'utf8'))
const base = (process.argv[2] ?? 'http://localhost:4317').replace(/\/$/, '')
const SITE = 'https://getrelvo.ai'

const status = async (path) => (await fetch(base + path, { redirect: 'manual', headers: { accept: '*/*' } })).status
const errors = []

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text()
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc.replace(SITE, '') || '/')
if (!paths.length) errors.push('sitemap.xml sin URLs')

for (const path of [...paths, '/sitemap.xml', '/robots.txt', '/llms.txt']) {
  const code = await status(path)
  if (code !== 200) errors.push(`${path}: ${code} (esperado 200)`)
}
for (const page of seo.pages.filter((p) => NOINDEX_PAGES.includes(p.id))) {
  const url = page.es.url
  const res = await fetch(base + url, { redirect: 'manual' })
  const html = await res.text()
  if (res.status !== 200) errors.push(`${url}: ${res.status} (esperado 200 con noindex)`)
  else if (!/<meta name="robots" content="noindex/.test(html)) errors.push(`${url}: sin noindex`)
  if (paths.includes(url)) errors.push(`${url}: está en el sitemap y debería quedar fuera`)
}
const untranslated = seo.pages.map((p) => p.en.url).filter((url) => !paths.includes(url))
for (const url of untranslated) {
  const code = await status(url)
  if (code !== 404) errors.push(`${url}: ${code} (sin traducción, esperado 404)`)
}

const missing = '/esta-pagina-no-existe'
const code404 = await status(missing)
if (code404 !== 404) errors.push(`${missing}: ${code404} (esperado 404)`)

if (errors.length) {
  for (const e of errors) console.error(`error  ${e}`)
  process.exit(1)
}
console.log(`check-routes: ${paths.length} URLs del sitemap y 3 archivos técnicos en 200, ${NOINDEX_PAGES.length} páginas noindex fuera del sitemap, ${untranslated.length} rutas en inglés sin traducción y una inexistente en 404 (${base})`)
