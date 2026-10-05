// Pide al servidor, sin headers especiales (como curl o un crawler), cada URL del sitemap y los
// archivos técnicos: todo debe responder 200. Una ruta inexistente debe responder 404.
// Uso: node scripts/check-routes.mjs [base]   (base por defecto: http://localhost:4317)
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
const missing = '/esta-pagina-no-existe'
const code404 = await status(missing)
if (code404 !== 404) errors.push(`${missing}: ${code404} (esperado 404)`)

if (errors.length) {
  for (const e of errors) console.error(`error  ${e}`)
  process.exit(1)
}
console.log(`check-routes: ${paths.length} URLs del sitemap y 3 archivos técnicos en 200, ruta inexistente en 404 (${base})`)
