// Supabase Edge Function: webhook de base de datos (INSERT en public.leads) → Attio.
// La lógica vive en attio.js (probada con node --test); acá solo HTTP y secretos.
// Despliegue y configuración: docs/medicion-y-aprendizaje.md §Leads → Attio.
//
// Secretos (supabase secrets set ...):
//   ATTIO_API_KEY         token de Attio con permisos de lectura/escritura en people, companies y notes
//   LEAD_WEBHOOK_SECRET   mismo valor que el header x-webhook-secret del webhook de la tabla
import { syncLeadToAttio } from './attio.js'

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })
  const secret = Deno.env.get('LEAD_WEBHOOK_SECRET')
  if (!secret || req.headers.get('x-webhook-secret') !== secret) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const apiKey = Deno.env.get('ATTIO_API_KEY')
  if (!apiKey) return Response.json({ error: 'Attio not configured' }, { status: 500 })

  const body = await req.json().catch(() => null)
  if (body?.type !== 'INSERT' || body?.table !== 'leads' || !body.record) return Response.json({ skipped: true })

  try {
    const result = await syncLeadToAttio(body.record, { apiKey })
    return Response.json({ ok: true, ...result })
  } catch (error) {
    // Sin datos del lead en el log: solo el error de Attio (método, ruta y status).
    console.error('[lead-to-attio]', error instanceof Error ? error.message : 'unknown error')
    return Response.json({ error: 'Attio sync failed' }, { status: 502 })
  }
})
