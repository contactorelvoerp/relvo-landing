// Print the GA4 configuration plan by default. --apply reconciles only the
// resources managed here; it never changes the property's primary channel group.
// Requires an OAuth token with analytics.edit scope in GA_ADMIN_ACCESS_TOKEN.
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'

export const desiredDimensions = [
  { parameterName: 'distribution_channel', displayName: 'Distribution channel', scope: 'EVENT' },
  { parameterName: 'distribution_surface', displayName: 'Distribution surface', scope: 'EVENT' },
  { parameterName: 'form', displayName: 'Lead form', scope: 'EVENT' },
  { parameterName: 'locale', displayName: 'Site language', scope: 'EVENT' },
  { parameterName: 'plan', displayName: 'Selected plan', scope: 'EVENT' },
  { parameterName: 'intent', displayName: 'Commercial intent', scope: 'EVENT' },
  // src/analytics.js: qué CTA y desde qué sección, por qué falla un formulario, hasta dónde se lee
  // y el rating de los Core Web Vitals de usuarios reales.
  { parameterName: 'placement', displayName: 'CTA placement', scope: 'EVENT' },
  { parameterName: 'destination', displayName: 'CTA destination', scope: 'EVENT' },
  { parameterName: 'reason', displayName: 'Form error reason', scope: 'EVENT' },
  { parameterName: 'percent', displayName: 'Scroll depth', scope: 'EVENT' },
  { parameterName: 'metric_rating', displayName: 'Web vital rating', scope: 'EVENT' },
]

// Las métricas de éxito del sitio (CLAUDE.md): formularios enviados y demos agendadas.
export const desiredKeyEvents = ['generate_lead', 'demo_agendada']

// Visitas que llegan desde asistentes de IA (GEO): sin esta regla GA4 las mezcla en "Referral".
const AI_SOURCES = 'chatgpt\\.com|openai\\.com|perplexity\\.ai|claude\\.ai|gemini\\.google\\.com|copilot\\.microsoft\\.com|chat\\.mistral\\.ai|deepseek\\.com|meta\\.ai|grok\\.com'
export function aiAssistantsRule() {
  return { displayName: 'AI assistants', expression: { andGroup: { filterExpressions: [
    { orGroup: { filterExpressions: [{ filter: { fieldName: 'source', stringFilter: { matchType: 'PARTIAL_REGEXP', value: AI_SOURCES } } }] } },
  ] } } }
}

// Match source/medium without changing historical campaign taxonomy.
export function poweredByRule() {
  return { displayName: 'Powered by Relvo', expression: { andGroup: { filterExpressions: [
    { orGroup: { filterExpressions: [{ filter: { fieldName: 'source', stringFilter: { matchType: 'EXACT', value: 'prefactura' } } }] } },
    { orGroup: { filterExpressions: [{ filter: { fieldName: 'medium', stringFilter: { matchType: 'EXACT', value: 'pdf' } } }] } },
  ] } } }
}

export async function configureAnalytics({ propertyId, measurementId = 'G-3612NJ7H02', token, apply = false, request = fetch }) {
  if (!/^\d+$/.test(propertyId)) throw new Error('GA_PROPERTY_ID must be the numeric property ID, not the G- measurement ID')
  if (!token) throw new Error('GA_ADMIN_ACCESS_TOKEN is required to inspect existing configuration')
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) throw new Error('GA_MEASUREMENT_ID must be a G- measurement ID')
  const parent = `properties/${propertyId}`
  const changes = []
  async function api(version, resource, method = 'GET', body) {
    const response = await request(`https://analyticsadmin.googleapis.com/${version}/${resource}`, {
      method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error(`GA Admin ${method} failed (${response.status})`)
    return response.json()
  }
  async function list(version, resource, key) {
    const all = []; let pageToken
    do {
      const result = await api(version, `${parent}/${resource}?pageSize=200${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`)
      all.push(...(result[key] ?? [])); pageToken = result.nextPageToken
    } while (pageToken)
    return all
  }
  // Validate the stream before writing anything: a valid property ID can still
  // belong to another website. This site uses full document navigation.
  const streams = await list('v1beta', 'dataStreams', 'dataStreams')
  const matches = streams.filter((stream) => stream.webStreamData?.measurementId === measurementId)
  if (matches.length !== 1) throw new Error(`Expected one web stream for ${measurementId}; found ${matches.length}`)
  const settingsPath = `${matches[0].name}/enhancedMeasurementSettings`
  const settings = await api('v1alpha', settingsPath)
  const pending = []
  const schedule = (resource, body, version, path, method = 'POST') => {
    changes.push({ resource, body })
    pending.push({ version, path, method, body })
  }
  // Protobuf JSON may omit false values; omission already means disabled.
  if (settings.formInteractionsEnabled === true || settings.pageChangesEnabled === true || settings.outboundClicksEnabled === true) {
    // Only these fields: retain every unrelated enhanced-measurement setting.
    // The Cal.com fallback URL carries private attribution references. Our
    // cta_click sends only a path/hostname; automatic link_url would expose them.
    schedule('enhancedMeasurementSettings', { formInteractionsEnabled: false, pageChangesEnabled: false, outboundClicksEnabled: false }, 'v1alpha', `${settingsPath}?updateMask=form_interactions_enabled,page_changes_enabled,outbound_clicks_enabled`, 'PATCH')
  }
  const keyEvents = await list('v1beta', 'keyEvents', 'keyEvents')
  for (const eventName of desiredKeyEvents) {
    if (keyEvents.some((event) => event.eventName === eventName)) continue
    const body = { eventName, countingMethod: 'ONCE_PER_EVENT' }
    schedule('keyEvents', body, 'v1beta', `${parent}/keyEvents`)
  }
  const dimensions = await list('v1beta', 'customDimensions', 'customDimensions')
  for (const dimension of desiredDimensions) {
    if (dimensions.some((existing) => existing.parameterName === dimension.parameterName && existing.scope === dimension.scope)) continue
    schedule('customDimensions', dimension, 'v1beta', `${parent}/customDimensions`)
  }
  const groups = await list('v1alpha', 'channelGroups', 'channelGroups')
  const defaultGroup = groups.find((group) => group.systemDefined)
  if (!defaultGroup) throw new Error('Default channel group missing; refusing to replace other traffic classification')
  const displayName = 'Relvo distribution'
  const existing = groups.find((group) => group.displayName === displayName && !group.systemDefined)
  const body = { displayName, description: 'Default channels plus Powered by Relvo PDF distribution and AI assistants.', groupingRule: [poweredByRule(), aiAssistantsRule(), ...defaultGroup.groupingRule] }
  if (!existing || JSON.stringify(existing.groupingRule) !== JSON.stringify(body.groupingRule)) {
    schedule('channelGroups', body, 'v1alpha', existing ? `${existing.name}?updateMask=display_name,description,grouping_rule` : `${parent}/channelGroups`, existing ? 'PATCH' : 'POST')
  }
  // Finish all reads before the first mutation so missing access or an invalid
  // channel group cannot leave a partially configured property.
  if (apply) for (const change of pending) await api(change.version, change.path, change.method, change.body)
  return { property: parent, stream: matches[0].name, measurementId, mode: apply ? 'apply' : 'plan', changes }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await configureAnalytics({ propertyId: process.env.GA_PROPERTY_ID ?? '', measurementId: process.env.GA_MEASUREMENT_ID, token: process.env.GA_ADMIN_ACCESS_TOKEN, apply: process.argv.includes('--apply') })
  const output = JSON.stringify(result, null, 2)
  const outputIndex = process.argv.indexOf('--output')
  if (outputIndex !== -1) fs.writeFileSync(process.argv[outputIndex + 1], output + '\n')
  else console.log(output)
}
