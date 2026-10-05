// Regla de bandas (Ricardo, 2026-10-03): nunca dos bandas de color (menta, oscura, verde)
// seguidas; entre ellas siempre una sección blanca o gris (--band-neutral). Corre sobre dist/.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')

// Cada sección declara su banda en la clase: band--mint, band--ink (color) o band--neutral (gris).
function kind(section) {
  const cls = (section.match(/^<section[^>]*class="([^"]*)"/) || [])[1]?.split(' ') ?? []
  if (cls.includes('band--ink')) return 'oscura'
  if (cls.includes('band--mint')) return 'menta'
  return cls.includes('band--neutral') ? 'gris' : 'blanca'
}

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name)
    return e.isDirectory() ? htmlFiles(full) : e.name.endsWith('.html') ? [full] : []
  })
}

const errors = []
for (const file of htmlFiles(dist)) {
  const main = fs.readFileSync(file, 'utf8').match(/<main>([\s\S]*?)<\/main>/)
  if (!main) continue
  const sections = main[1].split(/(?=<section[ >])/).filter((s) => s.startsWith('<section')).map(kind)
  sections.forEach((k, i) => {
    const prev = sections[i - 1]
    const color = (x) => ['oscura', 'verde', 'menta'].includes(x)
    if (i > 0 && color(k) && color(prev)) errors.push(`${path.relative(dist, file)}: banda ${prev} seguida de banda ${k} (secciones ${i} y ${i + 1})`)
  })
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log('check-bands: ninguna banda de color seguida de otra')
