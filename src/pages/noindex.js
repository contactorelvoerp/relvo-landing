// Páginas publicadas pero fuera del índice hasta que estén listas: responden 200, llevan
// noindex y no van al sitemap ni a llms.txt (las enlazan el menú, el footer y las migas).
// Las usan las rutas y scripts/og.mjs.
export const NOINDEX_PAGES = ['clientes', 'precios']
