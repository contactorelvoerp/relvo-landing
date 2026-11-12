import test from 'node:test'
import assert from 'node:assert/strict'
import middleware from '../middleware.js'

function request(path = '/', headers = {}, method = 'GET') {
  return new Request(`https://getrelvo.ai${path}`, { method, headers })
}

test('country chooses Spanish in Spanish-speaking markets and English elsewhere', () => {
  for (const country of ['CL', 'MX', 'CO', 'ES', 'AR', 'PE', 'PR']) {
    assert.equal(middleware(request('/', { 'x-vercel-ip-country': country, 'accept-language': 'en-US' })).headers.get('location'), null)
  }
  for (const country of ['US', 'GB', 'BR', 'DE']) {
    const response = middleware(request('/?utm_source=campaign', { 'x-vercel-ip-country': country }))
    assert.equal(response.status, 307)
    assert.equal(response.headers.get('location'), 'https://getrelvo.ai/en?utm_source=campaign')
    assert.equal(response.headers.get('cache-control'), 'private, no-store')
  }
})

test('manual choice overrides IP and saved preferences, including without client cookies', () => {
  const spanish = middleware(request('/?lang=es', { 'x-vercel-ip-country': 'US', cookie: 'relvo_language=en' }))
  assert.equal(spanish.headers.get('location'), null)
  assert.match(spanish.headers.get('set-cookie'), /relvo_language=es; Path=\/; Max-Age=31536000; SameSite=Lax; Secure/)
  assert.equal(middleware(request('/', { 'x-vercel-ip-country': 'US', cookie: 'other=1; relvo_language=es' })).headers.get('location'), null)
  assert.equal(middleware(request('/', { 'x-vercel-ip-country': 'CL', cookie: 'relvo_language=en; other=1' })).headers.get('location'), 'https://getrelvo.ai/en')
  assert.match(middleware(request('/en?lang=en')).headers.get('set-cookie'), /relvo_language=en/)
})

test('explicit English URLs, deep links, bots and non-page requests are never geo-redirected', () => {
  for (const path of ['/en', '/en/', '/agendar-demo', '/api/lead', '/sitemap.xml']) {
    assert.equal(middleware(request(path, { 'x-vercel-ip-country': 'US' })).headers.get('location'), null)
  }
  assert.equal(middleware(request('/', { 'x-vercel-ip-country': 'US', 'user-agent': 'Googlebot' })).headers.get('location'), null)
  assert.equal(middleware(request('/', { 'x-vercel-ip-country': 'US' }, 'POST')).headers.get('location'), null)
})

test('missing geolocation uses supported browser languages by quality, then Spanish', () => {
  assert.equal(middleware(request('/', { 'accept-language': 'fr, en-US;q=0.9, es;q=0.8' })).headers.get('location'), 'https://getrelvo.ai/en')
  assert.equal(middleware(request('/', { 'accept-language': 'en;q=0, es;q=0.5' })).headers.get('location'), null)
  assert.equal(middleware(request('/', { 'accept-language': 'en;q=invalid, es;q=0.5' })).headers.get('location'), null)
  assert.equal(middleware(request('/', { 'accept-language': 'fr', 'x-vercel-ip-country': 'XX1' })).headers.get('location'), null)
  assert.equal(middleware(request('/')).headers.get('location'), null)
})
