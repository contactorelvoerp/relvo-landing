// Receives Supabase Database Webhook events (INSERT on public.leads) and
// relays a formatted message to the Slack #ventas channel via Incoming Webhook.
//
// Configure in Supabase: Database -> Webhooks -> new webhook
//   Table: leads | Event: INSERT | Type: HTTP Request
//   URL: https://<your-domain>/api/lead-notify
//   HTTP Headers: x-webhook-secret: <same value as SUPABASE_WEBHOOK_SECRET>
//
// Env vars required (set in Vercel Project Settings -> Environment Variables):
//   SLACK_LEADS_WEBHOOK_URL  - Slack Incoming Webhook URL for #ventas
//   SUPABASE_WEBHOOK_SECRET  - shared secret to verify the request came from Supabase

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const expectedSecret = process.env.SUPABASE_WEBHOOK_SECRET
  if (expectedSecret && req.headers['x-webhook-secret'] !== expectedSecret) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const slackWebhookUrl = process.env.SLACK_LEADS_WEBHOOK_URL
  if (!slackWebhookUrl) {
    console.error('[lead-notify] Missing SLACK_LEADS_WEBHOOK_URL')
    res.status(500).json({ error: 'Slack webhook not configured' })
    return
  }

  const body = req.body || {}
  if (body.type !== 'INSERT' || !body.record) {
    res.status(200).json({ skipped: true })
    return
  }

  const lead = body.record
  const field = (label, value) => (value ? `*${label}:* ${value}` : null)

  const lines = [
    field('Nombre', lead.nombre),
    field('Email', lead.email),
    field('Empresa', lead.empresa),
    field('Cargo', lead.cargo),
    field('Problema', lead.problema),
    field('Fuente', lead.fuente),
    field('URL origen', lead.url_origen),
  ].filter(Boolean)

  const slackPayload = {
    text: `🎯 Nuevo lead: ${lead.nombre || 'sin nombre'} (${lead.empresa || 'sin empresa'})`,
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*🎯 Nuevo lead recibido*\n${lines.join('\n')}` },
      },
    ],
  }

  try {
    const slackRes = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload),
    })
    if (!slackRes.ok) {
      const text = await slackRes.text()
      console.error('[lead-notify] Slack error', slackRes.status, text)
      res.status(502).json({ error: 'Slack notification failed' })
      return
    }
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[lead-notify] Failed to notify Slack', err)
    res.status(500).json({ error: 'Internal error' })
  }
}
