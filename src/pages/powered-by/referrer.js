import { POWERED_BY_REFERRERS } from '../../config/powered-by-referrers'

// Slug crudo de `?cliente=<slug>` (sin validar contra el allowlist) y, si está en el allowlist
// (src/config/powered-by-referrers.js), el nombre a mostrar. Separado del `?ref=` que ya existe en
// producción para la atribución de ingresos por documento (shared/attribution.js, token opaco
// `v1.<hash>`) — no se lee ni se toca ese parámetro acá.
export function referrerFromSearch(search) {
  const slug = new URLSearchParams(search).get('cliente')
  return { slug, name: slug ? POWERED_BY_REFERRERS[slug] ?? null : null }
}
