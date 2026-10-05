// Valida el JSON-LD de cada HTML de dist/: que sea JSON válido, que traiga los campos que exige
// Google para cada tipo, que el BreadcrumbList enlace solo URLs publicadas y que el FAQPage tenga
// exactamente el texto visible de la FAQ (content/SCHEMA.md §5: nunca marcado sin su texto).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const SITE = 'https://getrelvo.ai'

const htmlFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const full = path.join(dir, e.name)
  return e.isDirectory() ? htmlFiles(full) : e.name === 'index.html' ? [full] : []
})
const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim()

const published = new Set(htmlFiles(dist).map((f) => {
  const rel = path.relative(dist, path.dirname(f)).replaceAll('\\', '/')
  return rel ? `${SITE}/${rel}` : `${SITE}/`
}))

const errors = []
let checked = 0, faqs = 0
for (const file of htmlFiles(dist)) {
  const html = fs.readFileSync(file, 'utf8')
  const rel = `/${path.relative(dist, file).replaceAll('\\', '/')}`
  if (!html.includes('index, follow') && !/data-status="live"/.test(html)) continue
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  if (!blocks.length) { errors.push(`${rel}: sin JSON-LD`); continue }
  for (const [, raw] of blocks) {
    let data
    try { data = JSON.parse(raw) } catch (e) { errors.push(`${rel}: JSON-LD inválido (${e.message})`); continue }
    checked++
    for (const node of data['@graph'] ?? [data]) {
      const t = node['@type']
      if (t === 'BreadcrumbList') {
        node.itemListElement.forEach((item, i) => {
          if (item.position !== i + 1 || !item.name || !item.item) errors.push(`${rel}: BreadcrumbList incompleto en la posición ${i + 1}`)
          else if (!published.has(item.item)) errors.push(`${rel}: BreadcrumbList enlaza a ${item.item}, que no está publicada`)
        })
      }
      if (t === 'SoftwareApplication' && !(node.name && node.applicationCategory && node.operatingSystem)) errors.push(`${rel}: SoftwareApplication sin name, applicationCategory u operatingSystem`)
      if (t === 'FAQPage') {
        faqs++
        const visible = [...html.matchAll(/<details[^>]*><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map(([, q, a]) => [decode(q), decode(a)])
        const marked = node.mainEntity.map((q) => [q.name, q.acceptedAnswer.text])
        if (visible.length !== marked.length) errors.push(`${rel}: FAQPage tiene ${marked.length} preguntas y la página muestra ${visible.length}`)
        marked.forEach(([q, a], i) => {
          if (!visible[i] || visible[i][0] !== q || visible[i][1] !== a) errors.push(`${rel}: la pregunta ${i + 1} del FAQPage no coincide con el texto visible`)
        })
      }
    }
  }
}

if (errors.length) {
  for (const e of errors) console.error(`error  ${e}`)
  process.exit(1)
}
console.log(`check-jsonld: ${checked} bloques válidos, ${faqs} FAQPage con el texto visible exacto`)
