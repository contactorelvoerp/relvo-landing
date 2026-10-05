// Gate de regla cero: sirve dist/ y corre `impeccable detect` sobre cada página
// renderizada en un navegador (el análisis estático no resuelve clamp() ni cqi).
// Falla con cualquier finding. Única excepción aprobada (Ricardo, 2026-10-02):
// Instrument Sans es la tipografía del manual de marca, así que
// "overused-font" no cuenta para ellas. Y el carrusel de logos del hero (marquee) está aprobado. Los avisos "advisory" se listan pero no bloquean.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const BRAND_FONTS = /instrument sans/i
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' }

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return htmlFiles(full)
    return entry.name.endsWith('.html') ? [full] : []
  })
}

// Se revisa lo que se publica (páginas listas y 404) más una página pendiente de muestra: las
// pendientes comparten la plantilla de placeholder y nunca llegan a producción.
const pages = htmlFiles(dist)
const status = (file) => (fs.readFileSync(file, 'utf8').match(/data-status="([^"]+)"/) || [])[1]
const isPlaceholder = (file) => fs.readFileSync(file, 'utf8').includes('class="pending"')
const targets = [...pages.filter((f) => status(f) !== 'pending'), ...pages.filter(isPlaceholder).slice(0, 1)]

const server = http.createServer((req, res) => {
  const clean = decodeURIComponent(req.url.split('?')[0])
  const candidates = [path.join(dist, clean), path.join(dist, clean, 'index.html'), path.join(dist, '404.html')]
  const file = candidates.find((c) => c.startsWith(dist) && fs.existsSync(c) && fs.statSync(c).isFile())
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
  fs.createReadStream(file).pipe(res)
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}`
const urls = targets.map((f) => `${base}/${path.relative(dist, f).replace(/\\/g, '/').replace(/(^|\/)index\.html$/, '')}`)

// Async: el servidor de arriba tiene que seguir respondiendo mientras corre impeccable.
const run = await new Promise((resolve) => {
  const child = spawn('npx', ['--no-install', 'impeccable', 'detect', '--json', ...urls], { cwd: root, shell: true })
  let stdout = '', stderr = ''
  child.stdout.on('data', (d) => { stdout += d })
  child.stderr.on('data', (d) => { stderr += d })
  child.on('close', () => resolve({ stdout, stderr }))
})
server.close()

let findings
try {
  findings = JSON.parse(run.stdout)
} catch {
  console.error(run.stdout, run.stderr)
  console.error('impeccable-gate: no se pudo leer la salida de impeccable')
  process.exit(1)
}

const approved = (f) => (f.antipattern === 'overused-font' && BRAND_FONTS.test(f.snippet))
  || (f.antipattern === 'marquee' && f.snippet.includes('logo-strip__track'))
const relevant = findings.filter((f) => !approved(f))
const blocking = relevant.filter((f) => !f.advisory)
const advisories = relevant.filter((f) => f.advisory)

const line = (f) => `  [${f.antipattern}] ${String(f.file).replace(base, '') || '/'}: ${f.snippet}`
const unique = (list) => [...new Set(list.map(line))]

if (advisories.length > 0) console.log(`Avisos (no bloquean):\n${unique(advisories).join('\n')}`)
if (blocking.length > 0) {
  console.error(`Findings:\n${unique(blocking).join('\n')}`)
  process.exit(1)
}
console.log(`impeccable-gate: ${urls.length} páginas sin findings (${findings.length - relevant.length} de tipografía de marca ignorados)`)
