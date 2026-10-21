import test from 'node:test'
import assert from 'node:assert/strict'
import { analyticsUrl, cleanAttribution, touchFromUrl } from '../shared/attribution.js'
import { captureAttribution } from '../src/attribution.js'

const reference = `v1.${'a'.repeat(64)}`
const entry = `https://getrelvo.ai/powered-by-relvo?utm_source=prefactura&utm_medium=pdf&utm_campaign=powered_by_relvo&utm_content=footer&ref=${reference}&surface=invoice_next`
const now = new Date('2026-10-21T12:00:00.000Z')
function browser(href) {
  const values = new Map()
  return { location: { href }, localStorage: { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) } }
}

test('first and latest attribution survive untagged demo navigation and retain the original landing time', () => {
  const win = browser(entry)
  const original = captureAttribution(win, now)
  const again = captureAttribution(win, new Date('2026-10-21T12:01:00.000Z'))
  assert.deepEqual(again, original)
  win.location.href = 'https://getrelvo.ai/agendar-demo'
  assert.deepEqual(captureAttribution(win, now), original)
  win.location.href = 'https://getrelvo.ai/precios?utm_source=google&utm_medium=cpc&utm_campaign=search'
  const second = captureAttribution(win, now)
  assert.equal(second.first_touch.reference, reference)
  assert.equal(second.last_touch.utm_source, 'google')
  assert.equal(second.last_touch.reference, undefined)
})

test('attribution expires after 30 days instead of refreshing its lifetime on every page', () => {
  const win = browser(entry)
  captureAttribution(win, now)
  win.location.href = 'https://getrelvo.ai/agendar-demo'
  assert.equal(captureAttribution(win, new Date('2026-11-21T12:00:00.000Z')).first_touch, null)
})

test('malformed or restricted storage does not block the website', () => {
  const win = browser(entry)
  win.localStorage.getItem = () => '{bad'
  win.localStorage.setItem = () => { throw new Error('blocked') }
  assert.equal(captureAttribution(win, now).last_touch.reference, reference)
})

test('analytics and CRM URLs exclude raw IDs, opaque references, fragments and unknown parameters', () => {
  const result = analyticsUrl(`${entry}&organization_id=private&client_id=private&contract_id=private&document_id=private&email=secret@example.com#secret`)
  assert.equal(result, 'https://getrelvo.ai/powered-by-relvo?utm_source=prefactura&utm_medium=pdf&utm_campaign=powered_by_relvo&utm_content=footer')
  assert.deepEqual(cleanAttribution({ first_touch: { utm_source: 'prefactura', reference: 'bad', organization_id: 'private', landing_path: '/?email=private' } }), { first_touch: { utm_source: 'prefactura' }, last_touch: null })
  assert.equal(touchFromUrl('https://getrelvo.ai/?ref=../secret', now), null)
})
