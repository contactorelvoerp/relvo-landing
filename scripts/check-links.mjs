// Falla si el sitio generado tiene links o assets internos rotos, o si un
// redirect de vercel.json apunta a una página que no existe. Corre sobre dist/.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return htmlFiles(full)
    return entry.name.endsWith('.html') ? [full] : []
  })
}

function exists(url) {
  const clean = decodeURIComponent(url.split('#')[0].split('?')[0])
  if (clean === '/') return fs.existsSync(path.join(dist, 'index.html'))
  const target = path.join(dist, clean)
  return [target, `${target}.html`, path.join(target, 'index.html')]
    .some((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile())
}

// Las rutas con rewrite a otro proyecto (el blog en /blog, vercel.json) las sirve ese proyecto: no se
// buscan en dist/
const { redirects = [], rewrites = [] } = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'))
const proxied = rewrites
  .filter((r) => /^https?:/.test(r.destination))
  .map((r) => new RegExp(`^${r.source.replace(/:\w+\*/g, '.*').replace(/:\w+/g, '[^/]+')}$`))
const external = (url) => proxied.some((re) => re.test(url.split('#')[0].split('?')[0]))

const errors = []

for (const file of htmlFiles(dist)) {
  const html = fs.readFileSync(file, 'utf8')
  for (const [, url] of html.matchAll(/\s(?:href|src)="(\/[^"/][^"]*|\/)"/g)) {
    if (!external(url) && !exists(url)) errors.push(`${path.relative(dist, file)}: ${url} no existe`)
  }
}

for (const { source, destination } of redirects) {
  if (exists(source)) errors.push(`redirect ${source}: el origen todavía existe como página`)
  if (destination.startsWith('/') && !exists(destination)) errors.push(`redirect ${source}: destino ${destination} no existe`)
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(`check-links: ${htmlFiles(dist).length} páginas y ${redirects.length} redirects sin links rotos`)
