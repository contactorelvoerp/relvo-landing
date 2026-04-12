const docModules = import.meta.glob('../../docs/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const docsByPath = Object.fromEntries(
  Object.entries(docModules).map(([path, content]) => [
    path.replace('../../docs/', ''),
    content.replace(/\r\n/g, '\n'),
  ]),
)

const createItem = (docPath, label, slug, children = []) => ({
  docPath,
  label,
  slug,
  children,
})

export const docsNavigation = [
  {
    title: 'Empezar',
    items: [
      createItem('get-started/overview.md', 'Inicio', '/docs'),
      createItem('get-started/como-funciona-relvo.md', 'Cómo funciona Relvo', '/docs/como-funciona-relvo'),
      createItem('get-started/flujo-recomendado.md', 'Flujo recomendado', '/docs/flujo-recomendado'),
      createItem('get-started/conceptos-clave.md', 'Conceptos clave', '/docs/conceptos-clave'),
    ],
  },
  {
    title: 'Revenue',
    items: [
      createItem('panel/overview.md', 'Panel', '/docs/panel'),
      createItem('clientes/overview.md', 'Clientes', '/docs/clientes', [
        createItem('clientes/crear-cliente.md', 'Crear cliente', '/docs/clientes/crear'),
        createItem('clientes/detalle-cliente.md', 'Ver cliente', '/docs/clientes/ver'),
      ]),
      createItem('contratos/overview.md', 'Contratos', '/docs/contratos', [
        createItem('contratos/crear-contrato.md', 'Crear contrato', '/docs/contratos/crear'),
        createItem('contratos/detalle-contrato.md', 'Ver contrato', '/docs/contratos/ver'),
        createItem('contratos/editar-contrato.md', 'Editar contrato', '/docs/contratos/editar'),
      ]),
      createItem('uso/overview.md', 'Uso', '/docs/uso', [
        createItem('uso/agregar-evento.md', 'Agregar evento', '/docs/uso/agregar-evento'),
        createItem('uso/importar-csv.md', 'Importar CSV', '/docs/uso/importar-csv'),
      ]),
      createItem('facturacion/overview.md', 'Facturación', '/docs/facturacion', [
        createItem('facturacion/detalle-factura.md', 'Ver factura', '/docs/facturacion/ver'),
      ]),
      createItem('aprobaciones/overview.md', 'Aprobaciones', '/docs/aprobaciones'),
      createItem('notificaciones/overview.md', 'Notificaciones', '/docs/notificaciones'),
      createItem('pricing/overview.md', 'Pricing', '/docs/pricing', [
        createItem('pricing/items.md', 'Items', '/docs/pricing/items'),
        createItem('pricing/metricas.md', 'Métricas', '/docs/pricing/metricas'),
        createItem('pricing/planes.md', 'Planes', '/docs/pricing/planes'),
      ]),
    ],
  },
  {
    title: 'Organización',
    items: [
      createItem('configuracion/overview.md', 'Configuración', '/docs/configuracion', [
        createItem('configuracion/politica-aprobaciones.md', 'Política de aprobaciones', '/docs/configuracion/politica-aprobaciones'),
        createItem('configuracion/preferencias-facturacion.md', 'Preferencias de facturación', '/docs/configuracion/preferencias-facturacion'),
      ]),
    ],
  },
  {
    title: 'Referencia',
    items: [
      createItem('referencia/navegacion.md', 'Navegación', '/docs/referencia/navegacion'),
      createItem('referencia/vistas-en-desarrollo.md', 'Vistas en desarrollo', '/docs/referencia/vistas-en-desarrollo'),
      createItem('referencia/reglas-practicas.md', 'Reglas prácticas', '/docs/referencia/reglas-practicas'),
    ],
  },
]

const flattenItems = (items) =>
  items.flatMap((item) => [item, ...flattenItems(item.children ?? [])])

const allDocs = docsNavigation.flatMap((section) => flattenItems(section.items))

const routeToDocPath = new Map(allDocs.map((item) => [item.slug, item.docPath]))
const docPathToRoute = new Map(allDocs.map((item) => [item.docPath, item.slug]))

export const getRouteForDocPath = (docPath) => docPathToRoute.get(docPath) || '/docs'

export const getDocPathFromRoute = (pathname) => {
  const normalizedPath = String(pathname || '').replace(/\/+$/, '') || '/docs'
  return routeToDocPath.get(normalizedPath) || 'get-started/overview.md'
}

export const getDocEntry = (pathname) => {
  const requestedPath = getDocPathFromRoute(pathname)
  const docPath = docsByPath[requestedPath] ? requestedPath : 'get-started/overview.md'
  const content = docsByPath[docPath]
  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch?.[1]?.trim() || 'Relvo Docs'
  const currentIndex = allDocs.findIndex((item) => item.docPath === docPath)
  const section = docsNavigation.find((group) =>
    flattenItems(group.items).some((item) => item.docPath === docPath)
  )

  return {
    docPath,
    content,
    title,
    sectionTitle: section?.title || 'Docs',
    previous: currentIndex > 0 ? allDocs[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null,
  }
}

export const slugifyHeading = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

export const getTableOfContents = (content) =>
  content
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => {
      const text = line.replace(/^##\s+/, '').trim()
      return { text, id: slugifyHeading(text) }
    })

const normalizeDocPath = (value) => {
  const normalized = []

  for (const segment of value.split('/')) {
    if (!segment || segment === '.') continue
    if (segment === '..') {
      normalized.pop()
      continue
    }
    normalized.push(segment)
  }

  return normalized.join('/')
}

export const resolveMarkdownHref = (currentDocPath, href) => {
  if (!href) return href
  if (href.startsWith('#')) return href
  if (/^(https?:|mailto:|tel:)/.test(href)) return href
  if (!href.endsWith('.md')) return href

  const currentDir = currentDocPath.split('/').slice(0, -1).join('/')
  const resolved = normalizeDocPath(`${currentDir}/${href}`)
  return getRouteForDocPath(resolved)
}
