import test from 'node:test'
import assert from 'node:assert/strict'
import { configureAnalytics } from '../scripts/configure-analytics.mjs'

function fixture(existing = false) {
  const calls = []
  const request = async (url, options) => {
    calls.push({ url, ...options })
    let result = {}
    if (url.includes('/keyEvents')) result = { keyEvents: existing ? [{ eventName: 'generate_lead' }, { eventName: 'demo_agendada' }] : [] }
    if (url.includes('/channelGroups')) result = { channelGroups: [{ systemDefined: true, groupingRule: [{ displayName: 'Direct', expression: {} }] }] }
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

test('GA apply skips existing key events and creates only missing resources', async () => {
  const { calls, request } = fixture(true)
  await configureAnalytics({ propertyId: '123', token: 'private', apply: true, request })
  assert.ok(calls.some((call) => call.method === 'POST'))
  assert.ok(!calls.some((call) => call.method === 'POST' && call.url.includes('/keyEvents')))
})

test('AI assistant rule matches assistant referrers and not ordinary sites', async () => {
  const { aiAssistantsRule } = await import('../scripts/configure-analytics.mjs')
  const pattern = new RegExp(aiAssistantsRule().expression.andGroup.filterExpressions[0].orGroup.filterExpressions[0].filter.stringFilter.value)
  for (const source of ['chatgpt.com', 'perplexity.ai', 'claude.ai', 'gemini.google.com', 'copilot.microsoft.com']) assert.ok(pattern.test(source), source)
  for (const source of ['google', 'linkedin.com', 'chatgptx.co']) assert.ok(!pattern.test(source), source)
})
