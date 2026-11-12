import test from 'node:test'
import assert from 'node:assert/strict'
import { referrerFromSearch } from '../src/pages/powered-by/referrer.js'
import { POWERED_BY_REFERRERS } from '../src/config/powered-by-referrers.js'

test('unknown, inherited and arbitrary referrers use generic copy and lead source', () => {
  for (const slug of ['', 'unknown', '__proto__', 'constructor', 'toString', '<script>']) {
    assert.deepEqual(referrerFromSearch(`?cliente=${encodeURIComponent(slug)}`), { slug: null, name: null })
  }
})

test('only explicitly authorized customer names are personalized', () => {
  POWERED_BY_REFERRERS['test-customer'] = 'Test Customer'
  try {
    assert.deepEqual(referrerFromSearch('?cliente=test-customer'), { slug: 'test-customer', name: 'Test Customer' })
  } finally { delete POWERED_BY_REFERRERS['test-customer'] }
})
