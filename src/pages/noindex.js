// Páginas publicadas pero fuera del índice hasta que estén listas: responden 200, llevan
// noindex y no van al sitemap ni a llms.txt (las enlazan el menú, el footer y las migas).
// Las usan las rutas y scripts/og.mjs.
// "lp-facturacion-b2b" es distinta: no está "hasta que esté lista", queda noindex para siempre
// (landing de Google Ads, no debe competir con la home) y no la enlaza nada del sitio.
export const NOINDEX_PAGES = ['clientes', 'lp-facturacion-b2b']
