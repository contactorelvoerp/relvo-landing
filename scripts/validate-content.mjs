// Valida content/**/*.json contra content/schema.mjs y las reglas de SEO de content/SCHEMA.md.
// Errores (detienen el build): schema, ruta del archivo distinta a su URL en seo-metadata.json,
// caso inexistente y palabra clave repetida. Avisos (no detienen): palabra clave ausente del H1/intro
// o de un H2, y palabras propias fuera de 450 a 700.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pageSchema } from '../content/schema.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = path.join(root, 'content')
const seo = JSON.parse(fs.readFileSync(path.join(root, 'reference/seo-metadata.json'), 'utf8'))

const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const full = path.join(dir, e.name)
  return e.isDirectory() ? files(full) : e.name.endsWith('.json') ? [full] : []
})

const errors = [], warnings = [], keywords = new Map(), pages = []
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
// La palabra clave va "de forma natural": se exige la raíz (5 letras) de cada palabra de 5 o más letras.
const stems = (s) => norm(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 5).map((w) => w.slice(0, 5))
const hasKeyword = (s, kw) => stems(kw).every((st) => norm(s).includes(st))
const count = (s) => (s ? s.trim().split(/\s+/).filter(Boolean).length : 0)

// Palabras propias: todo el texto de la página salvo los visuales (datos de ejemplo) y los bloques
// compartidos (related toma el texto del bento; integraciones y CTA son iguales en todo el sitio).
function ownWords(page) {
  let n = 0
  for (const b of page.blocks) {
    if (['related', 'integrations', 'cta', 'quote', 'case'].includes(b.type)) { n += count(b.h2) + count(b.h2Soft); continue }
    n += count(b.h1) + count(b.lead) + count(b.intro) + count(b.h2) + count(b.h2Soft) + count(b.note)
    for (const s of [...(b.before ?? []), ...(b.after ?? [])]) n += count(s)
    for (const s of b.steps ?? []) n += count(s.title) + count(s.text)
    for (const t of b.tabs ?? []) n += count(t.label) + count(t.desc)
    for (const k of b.kpis ?? []) n += count(k.label) + count(k.value)
    for (const q of b.items ?? []) if (q.q) n += count(q.q) + count(q.a)
  }
  return n
}

for (const file of files(contentDir)) {
  const rel = path.relative(root, file).replaceAll('\\', '/')
  let page
  try { page = JSON.parse(fs.readFileSync(file, 'utf8')) } catch (e) { errors.push(`${rel}: JSON inválido (${e.message})`); continue }
  const result = pageSchema.safeParse(page)
  if (!result.success) {
    for (const issue of result.error.issues) errors.push(`${rel}: ${issue.path.join('.')}: ${issue.message}`)
    continue
  }
  const locale = rel.split('/')[1]
  const meta = seo.pages.find((p) => p.id === page.seo)
  if (!meta) { errors.push(`${rel}: seo "${page.seo}" no existe en seo-metadata.json`); continue }
  const expected = `content/${locale}${meta[locale].url}.json`
  if (expected !== rel) errors.push(`${rel}: según su URL en seo-metadata.json debería estar en ${expected}`)

  const key = `${locale}:${norm(page.keyword)}`
  if (keywords.has(key)) errors.push(`${rel}: la palabra clave "${page.keyword}" ya es la principal de ${keywords.get(key)}`)
  keywords.set(key, rel)

  const hero = page.blocks[0]
  if (!hasKeyword(`${hero.h1} ${hero.intro ?? ''}`, page.keyword)) warnings.push(`${rel}: la palabra clave "${page.keyword}" no aparece en el H1 ni en la intro`)
  if (!page.blocks.some((b) => b.h2 && hasKeyword(`${b.h2} ${b.h2Soft ?? ''}`, page.keyword))) warnings.push(`${rel}: la palabra clave "${page.keyword}" no aparece en un H2`)

  const n = ownWords(page)
  if (n < 450 || n > 700) warnings.push(`${rel}: ${n} palabras propias (regla: 450 a 700)`)
  pages.push({ rel, page, n })
}

for (const { rel, page } of pages) {
  for (const b of page.blocks) {
    if ((b.type === 'case' || b.type === 'quote') && !pages.some((p) => p.page.id === b.ref && p.page.case)) {
      errors.push(`${rel}: el caso "${b.ref}" no existe o no trae datos en content/<idioma>/clientes/${b.ref}.json`)
    }
  }
}

for (const w of warnings) console.warn(`aviso  ${w}`)
if (errors.length) {
  for (const e of errors) console.error(`error  ${e}`)
  console.error(`validate-content: ${errors.length} errores en ${pages.length} archivos`)
  process.exit(1)
}
console.log(`validate-content: ${pages.length} archivos válidos (${warnings.length} avisos)`)
