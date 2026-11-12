import test from 'node:test'
import assert from 'node:assert/strict'
import { configureAnalytics, desiredDimensions, aiAssistantsRule, poweredByRule } from '../scripts/configure-analytics.mjs'

function fixture(existing = false, measurementId = 'G-3612NJ7H02') {
  const calls = []
  const request = async (url, options) => {
    calls.push({ url, ...options })
    let result = {}
    if (url.includes('/dataStreams?')) result = { dataStreams: [{ name: 'properties/123/dataStreams/456', webStreamData: { measurementId } }] }
    if (url.includes('/enhancedMeasurementSettings')) result = { ...(!existing ? { formInteractionsEnabled: true, pageChangesEnabled: true, outboundClicksEnabled: true } : {}), scrollsEnabled: true }
    if (url.includes('/keyEvents')) result = { keyEvents: existing ? [{ eventName: 'generate_lead' }, { eventName: 'demo_agendada' }] : [] }
    if (url.includes('/customDimensions')) result = { customDimensions: existing ? desiredDimensions : [] }
    if (url.includes('/channelGroups')) result = { channelGroups: [
      { systemDefined: true, groupingRule: [{ displayName: 'Direct', expression: {} }] },
      ...(existing ? [{ name: 'properties/123/channelGroups/789', displayName: 'Relvo distribution', groupingRule: [poweredByRule(), aiAssistantsRule(), { displayName: 'Direct', expression: {} }] }] : []),
    ] }
    return new Response(JSON.stringify(result))
  }
  return { calls, request }
}

test('GA plan only reads, preserves default channel rules, and never promotes clicks to conversions', async () => {
  const { calls, request } = fixture()
  const result = await configureAnalytics({ propertyId: '123', token: 'private', request })
  assert.ok(calls.every((call) => call.method === 'GET'))
  assert.deepEqual(result.changes.filter((change) => change.resource === 'keyEvents').map((change) => change.body.eventName), ['generate_lead', 'demo_agendada'])
  const group = result.changes.find((change) => change.resource === 'channelGroups').body
  assert.equal(group.groupingRule[0].displayName, 'Powered by Relvo')
  assert.equal(group.groupingRule[1].displayName, 'AI assistants')
  assert.equal(group.groupingRule[2].displayName, 'Direct')
  assert.equal(group.primary, undefined)
  assert.ok(!JSON.stringify(result).includes('private'))
})

test('GA apply is a no-op when configuration already matches', async () => {
  const { calls, request } = fixture(true)
  const result = await configureAnalytics({ propertyId: '123', token: 'private', apply: true, request })
  assert.deepEqual(result.changes, [])
  assert.ok(calls.every((call) => call.method === 'GET'))
})

test('GA apply disables duplicate form/history events and outbound URLs with private attribution after all reads', async () => {
  const { calls, request } = fixture()
  await configureAnalytics({ propertyId: '123', token: 'private', apply: true, request })
  const firstWrite = calls.findIndex((call) => call.method !== 'GET')
  assert.ok(firstWrite > 0)
  assert.ok(calls.slice(firstWrite).every((call) => call.method !== 'GET'))
  const patch = calls.find((call) => call.method === 'PATCH')
  assert.equal(patch.url, 'https://analyticsadmin.googleapis.com/v1alpha/properties/123/dataStreams/456/enhancedMeasurementSettings?updateMask=form_interactions_enabled,page_changes_enabled,outbound_clicks_enabled')
  assert.deepEqual(JSON.parse(patch.body), { formInteractionsEnabled: false, pageChangesEnabled: false, outboundClicksEnabled: false })
  for (const parameterName of ['plan', 'intent']) assert.ok(calls.some((call) => call.method === 'POST' && JSON.parse(call.body).parameterName === parameterName))
})

test('wrong stream or a failed settings read cannot partially configure the property', async () => {
  const { calls, request } = fixture(false, 'G-OTHER')
  await assert.rejects(configureAnalytics({ propertyId: '123', token: 'private', apply: true, request }), /Expected one web stream/)
  assert.ok(calls.every((call) => call.method === 'GET'))
  const fixture2 = fixture()
  await assert.rejects(configureAnalytics({ propertyId: '123', token: 'private', apply: true, request: (url, options) => url.includes('channelGroups') ? new Response('{}', { status: 403 }) : fixture2.request(url, options) }), /403/)
  assert.ok(fixture2.calls.every((call) => call.method === 'GET'))
})

test('AI assistant rule matches assistant referrers and not ordinary sites', async () => {
  const { aiAssistantsRule } = await import('../scripts/configure-analytics.mjs')
  const pattern = new RegExp(aiAssistantsRule().expression.andGroup.filterExpressions[0].orGroup.filterExpressions[0].filter.stringFilter.value)
  for (const source of ['chatgpt.com', 'perplexity.ai', 'claude.ai', 'gemini.google.com', 'copilot.microsoft.com']) assert.ok(pattern.test(source), source)
  for (const source of ['google', 'linkedin.com', 'chatgptx.co']) assert.ok(!pattern.test(source), source)
})
