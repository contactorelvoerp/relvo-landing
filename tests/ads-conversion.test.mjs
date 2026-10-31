import test from 'node:test'
import assert from 'node:assert/strict'
import { GOOGLE_ADS_CONVERSIONS, fireAdsConversion } from '../src/pages/landing-ads/ads-conversion.js'

test('a conversion with gtag available sets user_data before the conversion event, with the account send_to and a dedup transaction_id', () => {
  const calls = []
  const browser = { gtag: (...args) => calls.push(args) }
  fireAdsConversion({ ...GOOGLE_ADS_CONVERSIONS.form, transactionId: 'sub-1', email: 'a@b.com', phone: '+56912345678' }, browser)
  assert.deepEqual(calls, [
    ['set', 'user_data', { email: 'a@b.com', phone_number: '+56912345678' }],
    ['event', 'conversion', { send_to: 'AW-18546425614/QRcsCIvjwq8dEI7-z4tF', value: 50, currency: 'USD', transaction_id: 'sub-1' }],
  ])
})

test('no phone means user_data carries only the email', () => {
  const calls = []
  const browser = { gtag: (...args) => calls.push(args) }
  fireAdsConversion({ ...GOOGLE_ADS_CONVERSIONS.demo, transactionId: 'booking-1', email: 'a@b.com' }, browser)
  assert.deepEqual(calls[0], ['set', 'user_data', { email: 'a@b.com' }])
})

test('without gtag (previews never load tracking) it logs the same payload instead of throwing', () => {
  const logs = []
  const originalLog = console.log
  console.log = (...args) => logs.push(args)
  try {
    fireAdsConversion({ ...GOOGLE_ADS_CONVERSIONS.demo, transactionId: 'booking-2', email: 'a@b.com' }, {})
  } finally {
    console.log = originalLog
  }
  assert.equal(logs.length, 1)
  assert.equal(logs[0][0], '[ads-conversion]')
  assert.equal(logs[0][1].transaction_id, 'booking-2')
})
