// Páginas publicadas pero fuera del índice hasta que estén listas: responden 200, llevan
// noindex y no van al sitemap ni a llms.txt (las enlazan el menú, el footer y las migas).
// Las usan las rutas y scripts/og.mjs.
// "lp-facturacion-b2b" y "powered_by" son distintas: no están "hasta que estén listas", quedan
// noindex para siempre y no las enlaza nada del sitio. "lp-facturacion-b2b" es una landing de
// Google Ads que no debe competir con la home; "powered_by" solo la llega quien hace click en un
// correo de factura (brief de Ricardo, 2026-11-02: noindex, follow, fuera del sitemap).
export const NOINDEX_PAGES = ['clientes', 'lp-facturacion-b2b', 'powered_by']
