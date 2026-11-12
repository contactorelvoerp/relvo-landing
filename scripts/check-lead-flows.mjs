// Flujos de leads de punta a punta contra PostgreSQL + PostgREST desechables (la misma capa REST de
// Supabase), con las migraciones reales y los handlers reales de api/: formulario, reserva de
// Cal.com, etapa del CRM por email y feed de Google Ads. Los tests unitarios prueban qué se envía;
// esto prueba que la base lo acepta (upserts, ilike escapado, embebido de leads en el feed).
// Nunca se conecta a una base configurada: todo corre en contenedores sin datos reales.
import { spawnSync } from 'node:child_process'
import { createHmac, randomUUID } from 'node:crypto'
import fs from 'node:fs'

const id = randomUUID().slice(0, 8)
const net = `relvo-flows-${id}`
const db = `relvo-flows-db-${id}`
const rest = `relvo-flows-rest-${id}`
const JWT_SECRET = 'disposable-test-only-jwt-secret-0123456789'
const read = (file) => fs.readFileSync(new URL(file, import.meta.url), 'utf8')
const migrations = ['../supabase/migrations/202610210001_distribution_attribution.sql', '../supabase/migrations/202610310001_leads_telefono.sql'].map(read).join('\n')

function docker(args) {
  const result = spawnSync('docker', args, { encoding: 'utf8' })
  if (result.status !== 0) throw new Error(result.stderr || `docker ${args[0]} exited ${result.status}`)
  return result.stdout.trim()
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const psql = (sql) => docker(['exec', db, 'psql', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1', '-tAc', sql])
const b64 = (value) => Buffer.from(JSON.stringify(value)).toString('base64url')
function jwt(payload) {
  const body = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(payload)}`
  return `${body}.${createHmac('sha256', JWT_SECRET).update(body).digest('base64url')}`
}
function check(condition, message) { if (!condition) throw new Error(message) }
function response() {
  return { statusCode: 200, body: null, headers: {}, status(code) { this.statusCode = code; return this }, json(body) { this.body = body; return this }, send(body) { this.body = body; return this }, setHeader(k, v) { this.headers[k] = v }, end() { return this } }
}

try {
  docker(['network', 'create', net])
  docker(['run', '--rm', '-d', '--network', net, '--name', db, '-e', 'POSTGRES_PASSWORD=disposable-test-only', 'postgres:16-alpine'])
  let ready = false
  for (let attempt = 0; attempt < 40 && !ready; attempt++) {
    ready = spawnSync('docker', ['exec', db, 'psql', '-U', 'postgres', '-c', 'SELECT 1']).status === 0
    if (!ready) await sleep(300)
  }
  check(ready, 'PostgreSQL did not become ready')
  await sleep(1500) // initdb reinicia el servidor una vez: ver scripts/check-distribution-schema.mjs
  // Roles como en Supabase: el servidor usa service_role (bypass RLS); anon no ve nada.
  psql(`CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS;
CREATE ROLE authenticator LOGIN PASSWORD 'disposable-test-only' NOINHERIT; GRANT anon, service_role TO authenticator;
CREATE TABLE public.leads (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now(), nombre text, email text, empresa text, cargo text, problema text, url_origen text, fuente text);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
GRANT USAGE ON SCHEMA public TO anon, service_role; GRANT SELECT, INSERT ON public.leads TO service_role;`)
  psql(migrations)

  docker(['run', '--rm', '-d', '--network', net, '--name', rest, '-p', '127.0.0.1::3000',
    '-e', `PGRST_DB_URI=postgres://authenticator:disposable-test-only@${db}:5432/postgres`,
    '-e', 'PGRST_DB_SCHEMAS=public', '-e', 'PGRST_DB_ANON_ROLE=anon', '-e', `PGRST_JWT_SECRET=${JWT_SECRET}`,
    'postgrest/postgrest:v12.2.3'])
  const port = docker(['port', rest, '3000/tcp']).split(':').pop()
  const base = `http://127.0.0.1:${port}`
  let up = false
  for (let attempt = 0; attempt < 40 && !up; attempt++) {
    up = await fetch(`${base}/`).then((r) => r.ok).catch(() => false)
    if (!up) await sleep(300)
  }
  check(up, 'PostgREST did not become ready')

  // Los handlers hablan con `${SUPABASE_URL}/rest/v1/...` como en Supabase; PostgREST sirve en la raíz.
  const realFetch = globalThis.fetch
  globalThis.fetch = (url, options) => realFetch(String(url).replace('https://supabase.test/rest/v1', base), options)
  Object.assign(process.env, {
    SUPABASE_URL: 'https://supabase.test', SUPABASE_SERVICE_ROLE_KEY: jwt({ role: 'service_role' }),
    DISTRIBUTION_OUTCOME_SECRET: 'outcome-secret', CAL_WEBHOOK_SECRET: 'cal-secret',
    ADS_FEED_USER: 'ads', ADS_FEED_PASSWORD: 'feed', ADS_VALUE_QUALIFIED_LEAD: '50',
  })
  delete process.env.TURNSTILE_SECRET_KEY
  const { default: lead } = await import('../api/lead.js')
  const { default: outcome } = await import('../api/distribution-outcome.js')
  const { default: feed } = await import('../api/ads-conversions.js')
  const { POST: calBooking } = await import('../api/cal-booking.js')
  const { syncLeadToAttio } = await import('../supabase/functions/lead-to-attio/attio.js')

  // 1. Formulario con click de Ads; el reintento con el mismo submission_id no duplica.
  const submission = randomUUID()
  const form = { nombre: 'Ana Pérez', email: 'Ana_Perez@Empresa.test', empresa: 'Empresa', cargo: 'Otro', problema: 'Plan: startup\nRequest: demo\nConsulta de facturación', fuente: 'agendar_demo', url_origen: 'https://getrelvo.ai/agendar-demo?gclid=x', submission_id: submission, attribution: { ads_click: { gclid: 'Cj0KCQ_form-1', utm_campaign: 'b2b', recorded_at: new Date().toISOString() } } }
  for (const expected of [false, true]) {
    const res = response(); await lead({ method: 'POST', body: form }, res)
    check(res.statusCode === 200 && res.body.recorded && res.body.duplicate === expected, `form submit: ${res.statusCode} ${JSON.stringify(res.body)}`)
  }
  // Otro lead del mismo email sin click de Ads: el CRM debe atar la etapa al que tiene gclid.
  { const res = response(); await lead({ method: 'POST', body: { ...form, submission_id: randomUUID(), attribution: {} } }, res); check(res.statusCode === 200, 'second form') }

  // 2. Reserva de Cal.com firmada; Cal.com reintenta el mismo webhook.
  const booking = { triggerEvent: 'BOOKING_CREATED', payload: { uid: `bk_${id}`, attendees: [{ name: 'Luis Soto', email: 'luis@otra.test' }], responses: {}, metadata: { plan: 'custom', intent: 'demo', gclid: 'Cj0KCQ_cal-2', recorded_at: new Date().toISOString() } } }
  const raw = JSON.stringify(booking)
  for (let i = 0; i < 2; i++) {
    const res = await calBooking(new Request('https://getrelvo.ai/api/cal-booking', { method: 'POST', body: raw, headers: { 'x-cal-signature-256': createHmac('sha256', 'cal-secret').update(raw).digest('hex') } }))
    check(res.status === 200, `cal booking: ${res.status} ${await res.text()}`)
  }

  // 3. Attio marca al primer lead como calificado, con el email en otra capitalización.
  for (let i = 0; i < 2; i++) {
    const res = response()
    await outcome({ method: 'POST', headers: { authorization: 'Bearer outcome-secret' }, body: { stage: 'qualified_lead', email: 'ana_perez@empresa.TEST', event_id: 'attio:person:1:qualified_lead' } }, res)
    check(res.statusCode === 200, `outcome by email: ${res.statusCode} ${JSON.stringify(res.body)}`)
  }
  { const res = response(); await outcome({ method: 'POST', headers: { authorization: 'Bearer outcome-secret' }, body: { stage: 'qualified_lead', email: 'ana%perez@empresa.test', event_id: 'attio:x' } }, res); check(res.statusCode === 404, `wildcard email must not match: ${res.statusCode}`) }

  // 4. Estado en la base.
  check(psql('SELECT count(*) FROM public.leads') === '3', 'expected 3 leads (form, second form, booking)')
  check(psql(`SELECT fuente || '|' || nombre FROM public.leads WHERE email = 'luis@otra.test'`) === 'cal_booking|Luis Soto', 'booking lead')
  check(psql(`SELECT string_agg(stage, ',' ORDER BY stage) FROM public.distribution_outcomes`) === 'demo_booked,qualified_lead', 'one stage each, no duplicates')
  check(psql(`SELECT l.attribution->'ads_click'->>'gclid' FROM public.distribution_outcomes o JOIN public.leads l USING (submission_id) WHERE o.stage = 'qualified_lead'`) === 'Cj0KCQ_form-1', 'qualified stage tied to the lead with the ads click')

  // Storage → Attio contract for both updated flows. Capture requests instead of
  // contacting the CRM: no real people, companies, notes or notifications are created.
  const stored = await realFetch(`${base}/leads?select=*&submission_id=eq.${submission}`, { headers: { Authorization: `Bearer ${jwt({ role: 'service_role' })}` } }).then((r) => r.json())
  const booked = await realFetch(`${base}/leads?select=*&fuente=eq.cal_booking`, { headers: { Authorization: `Bearer ${jwt({ role: 'service_role' })}` } }).then((r) => r.json())
  check(stored[0].cargo === 'Otro' && stored[0].problema === form.problema, 'simplified form preserves commercial context in storage')
  check(booked[0].problema === 'Plan: custom\nRequest: demo', 'calendar preserves selected plan in storage')
  for (const row of [stored[0], booked[0]]) {
    const requests = []
    const fetcher = async (url, options) => {
      requests.push({ url, body: JSON.parse(options.body).data })
      return Response.json({ data: { id: { record_id: url.includes('/companies/') ? 'test-company' : 'test-person', note_id: 'test-note' } } })
    }
    await syncLeadToAttio(row, { apiKey: 'disposable-test-only', fetcher })
    check(requests.length === 3, 'Attio company, person and context note')
    check(requests[1].body.values.email_addresses[0].email_address === row.email, 'Attio identifies person by stored email')
    check(!('job_title' in requests[1].body.values), 'missing or neutral role never overwrites a curated Attio job title')
    check(requests[2].body.content.includes(row.problema), 'Attio note keeps selected plan, intent and message')
  }

  // 5. Feed de Google Ads con el embebido real de PostgREST.
  const res = response()
  await feed({ method: 'GET', headers: { authorization: `Basic ${Buffer.from('ads:feed').toString('base64')}` } }, res)
  check(res.statusCode === 200, `ads feed: ${res.statusCode} ${JSON.stringify(res.body)}`)
  const rows = res.body.trim().split('\n')
  check(rows[0] === 'Parameters:TimeZone=+0000' && rows.length === 4, `ads feed rows: ${res.body}`)
  check(rows.some((r) => r.startsWith('Cj0KCQ_form-1,Relvo - Lead calificado,') && r.endsWith(',50,USD')), 'qualified row')
  check(rows.some((r) => r.startsWith('Cj0KCQ_cal-2,Relvo - Demo agendada (CRM),')), 'booking row')

  // Reporting regression: one lead reaches several stages, one stays without
  // outcomes, and customers have different currencies. Milestones must not
  // multiply leads or combine acquisition value across currencies.
  for (const body of [
    { submission_id: submission, stage: 'demo_booked', event_id: 'report:demo' },
    { submission_id: submission, stage: 'customer', event_id: 'report:customer:usd', customer_reference: 'report-company-usd', revenue_amount: '1200.00', currency: 'USD' },
    { submission_id: booked[0].submission_id, stage: 'customer', event_id: 'report:customer:clp', customer_reference: 'report-company-clp', revenue_amount: '240000.00', currency: 'CLP' },
  ]) {
    const result = response()
    await outcome({ method: 'POST', headers: { authorization: 'Bearer outcome-secret' }, body }, result)
    check(result.statusCode === 200, `report outcome: ${result.statusCode}`)
  }
  // A newer campaign with no medium must not inherit cpc from an older ad.
  psql(`UPDATE public.leads SET attribution = '{"last_touch":{"utm_source":"newsletter","utm_campaign":"followup"},"ads_click":{"utm_source":"google","utm_medium":"cpc","utm_campaign":"old-paid"}}'::jsonb WHERE fuente = 'agendar_demo' AND submission_id <> '${submission}'`)
  const reports = read('../supabase/growth-funnel.sql').replace(/^--.*$/gm, '').split(';').filter((sql) => /\bSELECT\b/.test(sql))
  const reportRows = (sql) => JSON.parse(psql(`SELECT coalesce(json_agg(report), '[]') FROM (${sql}) report`))
  const funnel = reportRows(reports[0])
  const total = (key) => funnel.reduce((sum, row) => sum + row[key], 0)
  check(total('leads') === 3 && total('qualified_leads') === 1 && total('booked_demos') === 2 && total('customers') === 2, `growth funnel counts: ${JSON.stringify(funnel)}`)
  check(funnel.find((row) => row.source === 'newsletter')?.medium === '(not set)', 'campaign fields never mix separate touches')
  const value = reportRows(reports[1])
  check(value.length === 2 && value.find((row) => row.currency === 'USD')?.acquisition_value === 1200 && value.find((row) => row.currency === 'CLP')?.acquisition_value === 240000, 'acquisition value stays separated by currency')

  // 6. El navegador (anon) no puede leer leads ni etapas.
  const anon = await realFetch(`${base}/leads?select=email`)
  check(anon.status === 401 || anon.status === 403 || (anon.ok && (await anon.json()).length === 0), `anon must not read leads (${anon.status})`)

  console.log('check-lead-flows: formulario, reserva, Attio (capturado), etapas, feed de Ads y reportes de cohortes sin duplicados contra PostgREST real: OK')
} finally {
  spawnSync('docker', ['rm', '-f', rest, db], { stdio: 'ignore' })
  spawnSync('docker', ['network', 'rm', net], { stdio: 'ignore' })
}
