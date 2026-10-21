import { REFERENCE_PATTERN } from '../shared/attribution.js'

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export { REFERENCE_PATTERN }

export function storageConfig() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return url && key ? { url, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' } } : null
}

export function sameOrigin(req) {
  // An origin check limits cross-site browser spam; it is not authentication.
  const allowed = new Set(['https://getrelvo.ai'])
  if (process.env.VERCEL_URL) allowed.add(`https://${process.env.VERCEL_URL}`)
  if (process.env.NODE_ENV !== 'production') allowed.add('http://localhost:3000')
  return typeof req.headers?.origin === 'string' && allowed.has(req.headers.origin)
}
