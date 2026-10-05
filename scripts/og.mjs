// Imagen Open Graph (1200×630) de cada página publicada: su H1 sobre el fondo de marca (menta con la
// textura Órbitas), con el logo oficial (public/logo-logotype-dark.svg) y el dominio. Corre en el
// build, antes de prerender.mjs, y escribe dist/og/<id>-<idioma>.png (prerender la enlaza si existe).
// H1: el del archivo de contenido en las plantillas, el de su copy en la home y la demo, y el title
// (que es su H1) en las páginas en preparación.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import { copy as homeCopy } from '../src/pages/home/copy.js'
import { copy as demoCopy } from '../src/pages/demo/copy.js'
import { NOINDEX_PAGES } from '../src/pages/noindex.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const seo = JSON.parse(fs.readFileSync(path.join(root, 'reference/seo-metadata.json'), 'utf8'))
const font = path.join(root, 'public/fonts/instrument-sans/InstrumentSans-Medium.ttf')
const logo = `data:image/svg+xml;base64,${fs.readFileSync(path.join(root, 'public/logo-logotype-dark.svg')).toString('base64')}`
const W = 1200, H = 630

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Corte de líneas por ancho estimado (Instrument Sans Medium: ~0,52 em por carácter)
function wrap(text, size, max) {
  const lines = []
  let line = ''
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (next.length * size * 0.52 > max && line) { lines.push(line); line = word } else line = next
  }
  return [...lines, line]
}

// Órbitas (DS v1.5), primer cuadro, en la mitad derecha
function orbits() {
  const arcs = []
  for (const [cx, cy, a, sweep] of [[W * 0.62, H * 1.15, 0.5, 0.9], [W * 1.08, -H * 0.12, 0.32, 1.2]]) {
    const max = Math.hypot(W * 0.5, H) * 1.05
    for (let r = 30; r < max; r += 11) {
      const s = -Math.PI / 2 + Math.sin(r * 0.01) * 0.12, e = s + Math.PI * sweep
      const p = (t) => `${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`
      arcs.push(`<path d="M${p(s)} A${r} ${r} 0 ${sweep > 1 ? 1 : 0} 1 ${p(e)}" fill="none" stroke="rgb(24,102,102)" stroke-opacity="${(a * (1 - r / max)).toFixed(3)}"/>`)
    }
  }
  return arcs.join('')
}

function svg(title) {
  let size = 68, lines = wrap(title, size, 820)
  if (lines.length > 3) { size = 56; lines = wrap(title, size, 860) }
  const lead = size * 1.1, top = H - 130 - lead * (lines.length - 1)
  const text = lines.map((l, i) => `<tspan x="72" y="${(top + i * lead).toFixed(0)}">${esc(l)}</tspan>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#DFF4EB"/>${orbits()}
  <image href="${logo}" x="72" y="64" width="132" height="34"/>
  <text font-family="Instrument Sans" font-size="${size}" font-weight="500" letter-spacing="-1.6" fill="#13131E">${text}</text>
  <line x1="72" x2="${W - 72}" y1="${H - 74}" y2="${H - 74}" stroke="#13131E" stroke-opacity=".18"/>
  <text x="72" y="${H - 40}" font-family="Instrument Sans" font-size="22" fill="#3F3F4C">getrelvo.ai</text>
</svg>`
}

const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const full = path.join(dir, e.name)
  return e.isDirectory() ? files(full) : e.name.endsWith('.json') ? [full] : []
})

const out = path.join(root, 'dist/og')
fs.mkdirSync(out, { recursive: true })
const render = (h1) => new Resvg(svg(h1), { font: { fontFiles: [font], loadSystemFonts: false, defaultFontFamily: 'Instrument Sans' } }).render().asPng()

// [id, idioma, H1] de cada página
const pages = [
  ['home', 'es', homeCopy.es.hero.title],
  ['demo', 'es', demoCopy.es.title],
  ['demo', 'en', demoCopy.en.title],
  ...seo.pages.filter((p) => NOINDEX_PAGES.includes(p.id)).map((p) => [p.id, 'es', p.es.title]),
]
for (const file of files(path.join(root, 'content'))) {
  const page = JSON.parse(fs.readFileSync(file, 'utf8'))
  const locale = path.relative(path.join(root, 'content'), file).split(path.sep)[0]
  if (seo.pages.some((p) => p.id === page.seo)) pages.push([page.seo, locale, page.blocks[0].h1])
}
for (const [id, locale, h1] of pages) fs.writeFileSync(path.join(out, `${id}-${locale}.png`), render(h1))
console.log(`og: ${pages.length} imágenes (H1 sobre fondo de marca)`)
