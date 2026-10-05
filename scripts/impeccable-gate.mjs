// Gate de regla cero: corre `impeccable detect` sobre dist/ y falla con cualquier finding.
// Única excepción aprobada (Ricardo, 2026-10-02): Instrument Sans y Geist Mono son las
// tipografías del manual de marca, así que "overused-font" no cuenta para ellas.
// Los avisos "advisory" se listan pero no bloquean.
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BRAND_FONTS = /instrument sans|geist mono/i

const run = spawnSync('npx', ['--no-install', 'impeccable', 'detect', '--json', 'dist'], {
  cwd: root,
  encoding: 'utf8',
  shell: true,
  maxBuffer: 64 * 1024 * 1024,
})

let findings
try {
  findings = JSON.parse(run.stdout)
} catch {
  console.error(run.stdout, run.stderr)
  console.error('impeccable-gate: no se pudo leer la salida de impeccable')
  process.exit(1)
}

const relevant = findings.filter((f) => !(f.antipattern === 'overused-font' && BRAND_FONTS.test(f.snippet)))
const blocking = relevant.filter((f) => !f.advisory)
const advisories = relevant.filter((f) => f.advisory)

const line = (f) => `  [${f.antipattern}] ${path.relative(root, f.file)}: ${f.snippet}`
const unique = (list) => [...new Set(list.map(line))]

if (advisories.length > 0) console.log(`Avisos (no bloquean):\n${unique(advisories).join('\n')}`)
if (blocking.length > 0) {
  console.error(`Findings:\n${unique(blocking).join('\n')}`)
  process.exit(1)
}
console.log(`impeccable-gate: sin findings (${findings.length - relevant.length} de tipografía de marca ignorados)`)
