import test from 'node:test'
import assert from 'node:assert/strict'
import { GOOGLE_ADS_CONVERSIONS, fireAdsConversion, toE164 } from '../src/pages/landing-ads/ads-conversion.js'

const PROD = { hostname: 'getrelvo.ai' }

test('a conversion with gtag available on getrelvo.ai sets user_data before the conversion event, with the account send_to and a dedup transaction_id', () => {
  const calls = []
  const browser = { location: PROD, gtag: (...args) => calls.push(args) }
  fireAdsConversion({ ...GOOGLE_ADS_CONVERSIONS.form, transactionId: 'sub-1', email: 'a@b.com', phone: '+56912345678' }, browser)
  assert.deepEqual(calls, [
    ['set', 'user_data', { email: 'a@b.com', phone_number: '+56912345678' }],
    ['event', 'conversion', { send_to: 'AW-18546425614/QRcsCIvjwq8dEI7-z4tF', value: 50, currency: 'USD', transaction_id: 'sub-1' }],
  ])
})

test('no phone means user_data carries only the email', () => {
  const calls = []
  const browser = { location: PROD, gtag: (...args) => calls.push(args) }
  fireAdsConversion({ ...GOOGLE_ADS_CONVERSIONS.demo, transactionId: 'booking-1', email: 'a@b.com' }, browser)
  assert.deepEqual(calls[0], ['set', 'user_data', { email: 'a@b.com' }])
})

test('without gtag (previews never load tracking) it logs the same payload instead of throwing', () => {
  const logs = []
  const originalLog = console.log
  console.log = (...args) => logs.push(args)
  try {
    fireAdsConversion({ ...GOOGLE_ADS_CONVERSIONS.demo, transactionId: 'booking-2', email: 'a@b.com' }, { location: PROD })
  } finally {
    console.log = originalLog
  }
  assert.equal(logs.length, 1)
  assert.equal(logs[0][0], '[ads-conversion]')
  assert.equal(logs[0][1].transaction_id, 'booking-2')
})

test('gtag present but on a non-canonical host (e.g. a Vercel production alias) still only logs', () => {
  const calls = []
  const logs = []
  const originalLog = console.log
  console.log = (...args) => logs.push(args)
  try {
    const browser = { location: { hostname: 'relvo-landing.vercel.app' }, gtag: (...args) => calls.push(args) }
    fireAdsConversion({ ...GOOGLE_ADS_CONVERSIONS.demo, transactionId: 'booking-3', email: 'a@b.com' }, browser)
  } finally {
    console.log = originalLog
  }
  assert.equal(calls.length, 0)
  assert.equal(logs.length, 1)
  assert.equal(logs[0][1].transaction_id, 'booking-3')
})

test('toE164 strips formatting and keeps only digits behind a leading +', () => {
  assert.equal(toE164('+56 9 1234 5678'), '+56912345678')
  assert.equal(toE164('56 9 1234 5678'), '+56912345678')
  assert.equal(toE164(''), undefined)
  assert.equal(toE164(undefined), undefined)
})
