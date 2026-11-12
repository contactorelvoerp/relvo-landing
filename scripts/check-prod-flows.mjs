// Humo de los flujos de leads en el sitio publicado, sin escribir nada: cada request se rechaza antes
// de tocar Supabase, Slack o Attio. Prueba que cada función esté desplegada, que responda con su
// propia lógica (no un 404 o un 500 de Vercel) y que tenga sus secretos configurados (503 = falta
// una variable de entorno). Corre después de cada deploy de producción (.github/workflows/seo-prod.yml).
// Uso: node scripts/check-prod-flows.mjs [base]   (base por defecto: https://getrelvo.ai)
const base = (process.argv[2] ?? 'https://getrelvo.ai').replace(/\/$/, '')
const errors = []

async function expect(label, path, init, statuses) {
  try {
    const res = await fetch(`${base}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(10000), ...init, headers: { 'user-agent': 'relvo-flows-check', ...init?.headers } })
    const type = res.headers.get('content-type') ?? ''
    if (!statuses.includes(res.status)) {
      const action = path === '/api/cal-booking' && res.status === 503 ? '; configurar CAL_WEBHOOK_SECRET en Vercel Production y el mismo secreto en Cal.com, luego redeploy (docs/medicion-y-aprendizaje.md)' : ''
      errors.push(`${label}: ${res.status} (esperado ${statuses.join(' o ')})${action}`)
    }
    else if (res.status !== 405 && !type.includes('json')) errors.push(`${label}: respuesta sin JSON (${type}), no es la función`)
  } catch (error) { errors.push(`${label}: ${error.message}`) }
}
const json = (body, headers = {}) => ({ method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) })

// Formulario: un envío vacío falla la validación (400) antes de guardar nada.
await expect('formulario /api/lead', '/api/lead', json({}), [400, 403])
// Webhooks y feed: sin firma ni credenciales → 401. 503 sería que falta su secreto en Vercel.
await expect('reserva /api/cal-booking', '/api/cal-booking', json({ triggerEvent: 'PING' }), [401])
await expect('etapas /api/distribution-outcome', '/api/distribution-outcome', json({}), [401])
await expect('feed /api/ads-conversions', '/api/ads-conversions', { method: 'GET' }, [401])
await expect('aviso /api/lead-notify', '/api/lead-notify', { method: 'GET' }, [405])
// Eventos del embudo: sin origen permitido → 403.
await expect('eventos /api/distribution-event', '/api/distribution-event', json({}), [403])

if (errors.length) {
  console.error(`check-prod-flows: ${errors.length} problema(s) en ${base}\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`check-prod-flows: formulario, reserva, etapas, feed de Ads, aviso y eventos responden con su propia lógica (${base})`)
