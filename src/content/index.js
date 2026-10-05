// Contenido de las páginas de plantilla (content/<idioma>/<url>.json, validado en el build por
// scripts/validate-content.mjs). En el servidor se cargan todos los archivos; en el navegador, solo
// los de la página (más el caso que referencia) y antes de hidratar, para que el HTML coincida.
const EAGER = import.meta.env.SSR ? import.meta.glob('/content/**/*.json', { eager: true, import: 'default' }) : {}
const LAZY = import.meta.env.SSR ? {} : import.meta.glob('/content/**/*.json', { import: 'default' })

const loaded = { ...EAGER }

// La ruta del archivo sale de la URL de la página: /producto/cuentas-por-cobrar →
// /content/es/producto/cuentas-por-cobrar.json (el validador exige que coincidan).
const fileFor = (locale, path) => `/content/${locale}${path}.json`
const caseFile = (locale, ref) => `/content/${locale}/clientes/${ref}.json`

export function getContent(locale, path) {
  return loaded[fileFor(locale, path)] ?? null
}

export function getCase(locale, ref) {
  return loaded[caseFile(locale, ref)]?.case ?? null
}

// Navegador: trae el archivo de la página y los casos que referencia antes de hidratar.
export async function loadContent(locale, path) {
  const file = fileFor(locale, path)
  if (!LAZY[file]) return
  loaded[file] = await LAZY[file]()
  const refs = new Set(loaded[file].blocks.filter((b) => b.ref).map((b) => b.ref))
  await Promise.all([...refs].map(async (ref) => {
    const f = caseFile(locale, ref)
    if (LAZY[f] && !loaded[f]) loaded[f] = await LAZY[f]()
  }))
}
