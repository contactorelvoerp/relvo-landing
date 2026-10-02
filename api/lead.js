// Recibe el formulario de contacto del sitio y guarda el lead en la tabla `leads` de Supabase.
// La key de Supabase vive solo acá (servidor); el navegador nunca la ve.
// El aviso a Slack sale del webhook de la tabla (api/lead-notify.js).
//
// Variables de entorno (Vercel → Project Settings → Environment Variables):
//   SUPABASE_URL                (o la ya existente VITE_SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY   (o SUPABASE_ANON_KEY / VITE_SUPABASE_ANON_KEY si la tabla permite insert anónimo)

const FIELDS = ['nombre', 'email', 'empresa', 'cargo', 'problema', 'url_origen', 'fuente']
const REQUIRED = ['nombre', 'email', 'empresa', 'cargo']
const MAX_LENGTH = 2000

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const body = typeof req.body === 'object' && req.body !== null ? req.body : {}

  // Honeypot: un bot completó el campo oculto. Se responde OK sin guardar nada.
  if (body.website) {
    res.status(200).json({ ok: true })
    return
  }

  const lead = {}
  for (const key of FIELDS) {
    const value = typeof body[key] === 'string' ? body[key].trim().slice(0, MAX_LENGTH) : ''
    if (value) lead[key] = value
  }
  const missing = REQUIRED.filter((key) => !lead[key])
  if (missing.length > 0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    res.status(400).json({ error: 'Invalid lead', missing })
    return
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.error('[lead] Missing Supabase env vars')
    res.status(500).json({ error: 'Lead storage not configured' })
    return
  }

  const insert = await fetch(`${url}/rest/v1/leads`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(lead),
  })
  if (!insert.ok) {
    console.error('[lead] Supabase insert failed', insert.status, await insert.text())
    res.status(502).json({ error: 'Could not save lead' })
    return
  }

  res.status(200).json({ ok: true })
}
