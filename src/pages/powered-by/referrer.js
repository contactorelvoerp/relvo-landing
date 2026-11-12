import { POWERED_BY_REFERRERS } from '../../config/powered-by-referrers.js'

// Slug y nombre de `?cliente=<slug>`, solo si está autorizado en el allowlist
// (src/config/powered-by-referrers.js). Separado del `?ref=` que ya existe en
// producción para la atribución de ingresos por documento (shared/attribution.js, token opaco
// `v1.<hash>`) — no se lee ni se toca ese parámetro acá.
export function referrerFromSearch(search) {
  const slug = new URLSearchParams(search).get('cliente')
  const name = slug && Object.hasOwn(POWERED_BY_REFERRERS, slug) ? POWERED_BY_REFERRERS[slug] : null
  return typeof name === 'string' && name.trim() ? { slug, name } : { slug: null, name: null }
}
