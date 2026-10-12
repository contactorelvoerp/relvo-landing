// Revisa la indexación del sitio publicado (CLAUDE.md, SEO). Falla si:
// - una URL del sitemap no responde 200, lleva noindex (meta o X-Robots-Tag) o su canonical no es ella misma;
// - un redirect de vercel.json no responde 301 al destino del mapa;
// - www no redirige con 301 al host canónico preservando path y query.
// Uso: node scripts/check-prod-seo.mjs [base]   (base por defecto: https://getrelvo.ai)
import fs from 'node:fs'

const base = (process.argv[2] ?? 'https://getrelvo.ai').replace(/\/$/, '')
const SITE = 'https://getrelvo.ai'
const errors = []

const get = (url) => fetch(url, { redirect: 'manual', headers: { 'user-agent': 'relvo-seo-check' } })

// Páginas del sitemap: indexables y con canonical autorreferente
const sitemap = await (await get(`${base}/sitemap.xml`)).text()
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc)
if (!locs.length) errors.push('sitemap.xml sin URLs')

for (const loc of locs) {
  const res = await get(base + (loc.replace(SITE, '') || '/'))
  if (res.status !== 200) {
    errors.push(`${loc}: ${res.status} (esperado 200)`)
    continue
  }
  const html = await res.text()
  if (/noindex/i.test(res.headers.get('x-robots-tag') ?? '')) errors.push(`${loc}: X-Robots-Tag noindex`)
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? ''
  if (/noindex/i.test(robots)) errors.push(`${loc}: meta robots "${robots}"`)
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]
  if (canonical !== loc) errors.push(`${loc}: canonical ${canonical ?? '(falta)'}`)
}

// Mapa de redirects: solo las reglas sin parámetros ni condiciones (las demás se prueban aparte)
const { redirects } = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
const fixed = redirects.filter((r) => !r.has && !r.source.includes(':'))
for (const r of fixed) {
  const res = await get(base + r.source)
  const location = res.headers.get('location')
  const target = location && new URL(location, base + '/').href
  const expected = new URL(r.destination, base + '/').href
  if (res.status !== 301) errors.push(`${r.source}: ${res.status} (esperado 301 → ${r.destination})`)
  else if (target !== expected) errors.push(`${r.source}: 301 → ${location} (esperado ${r.destination})`)
}

// www → host canónico, con path y query
if (base === SITE) {
  const res = await get('https://www.getrelvo.ai/producto/agentes?ref=check')
  const location = res.headers.get('location')
  if (res.status !== 301 || location !== `${SITE}/producto/agentes?ref=check`) {
    errors.push(`www: ${res.status} → ${location ?? '(sin location)'} (esperado 301 → ${SITE}/producto/agentes?ref=check)`)
  }
}

if (errors.length) {
  for (const e of errors) console.error(`error  ${e}`)
  process.exit(1)
}
console.log(`check-prod-seo: ${locs.length} URLs indexables con canonical propio y ${fixed.length} redirects 301 correctos (${base})`)
