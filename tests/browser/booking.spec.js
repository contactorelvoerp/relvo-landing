import { test, expect } from '@playwright/test'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

let server, base
const dist = path.resolve('dist')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png' }
test.beforeAll(async () => {
  server = http.createServer((req, res) => {
    let file = path.join(dist, new URL(req.url, `http://${req.headers.host}`).pathname)
    if (!path.extname(file)) file = path.join(file, 'index.html')
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end('Not found') }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' })
    fs.createReadStream(file).pipe(res)
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  base = `http://127.0.0.1:${server.address().port}`
})
test.afterAll(async () => { await new Promise((resolve) => server.close(resolve)) })

// Exercise the SDK boundary without creating meetings or depending on third-party uptime.
async function calendarDouble(page) {
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url())
    return url.hostname === '127.0.0.1' ? route.continue() : route.abort()
  })
  await page.addInitScript(() => {
    const callbacks = {}
    window.__emitCal = (action, data) => (callbacks[action] ?? []).forEach((callback) => callback({ detail: { data } }))
    const namespaced = (action, options) => {
      if (action === 'on') (callbacks[options.action] ??= []).push(options.callback)
      if (action === 'ui') window.__calendarUi = options
      if (action === 'inline') {
        window.__calendarConfig = options.config
        window.__calendarLink = options.calLink
        window.__emitCal('linkReady')
      }
    }
    window.Cal = (action, namespace) => { if (action === 'init') window.Cal.ns[namespace] = namespaced }
    window.Cal.ns = {}
    window.Cal.loaded = true
  })
}

for (const locale of ['es', 'en']) {
  const demoPath = locale === 'es' ? '/agendar-demo' : '/en/book-a-demo'
  for (const width of [320, 390, 1440]) {
    test(`${locale} booking is primary and email is secondary at ${width}px`, async ({ page }) => {
      await calendarDouble(page)
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`${base}${demoPath}?plan=startup`)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('.cal-panel__heading')).toContainText('30')
      await expect(page.locator('.demo__context')).toContainText('Startup')
      await expect(page.locator('#consulta')).not.toHaveAttribute('open')
      await expect(page.locator('.cal-panel__form-body')).toBeHidden()
      await page.locator('.cal-panel__form-toggle').focus()
      await page.keyboard.press('Enter')
      await expect(page.locator('.cal-panel__form-body')).toBeVisible()
      await expect(page.locator('form input[required]')).toHaveCount(3)
      await expect(page.locator('#lead-cargo, #lead-telefono, #pricing-plan')).toHaveCount(0)
      await expect(page.locator('#lead-problema')).not.toHaveAttribute('required')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    })
  }

  test(`${locale} booking metadata survives failure and only a real booking emits a booking conversion`, async ({ page }) => {
    await calendarDouble(page)
    await page.goto(`${base}${demoPath}?plan=startup&utm_source=booking-test`)
    await expect.poll(() => page.evaluate(() => window.__calendarConfig?.['metadata[plan]'])).toBe('startup')
    await page.evaluate(() => {
      window.__RELVO_ANALYTICS__ = {}
      window.__bookingEvents = []
      window.gtag = (...args) => window.__bookingEvents.push(args)
    })
    const config = await page.evaluate(() => window.__calendarConfig)
    expect(config['metadata[intent]']).toBe('demo')
    expect(config['metadata[locale]']).toBe(locale)
    expect(config['metadata[utm_source]']).toBe('booking-test')
    expect(await page.evaluate(() => window.__calendarUi.hideEventTypeDetails)).toBe(true)
    expect(await page.evaluate(() => window.__calendarUi.showTimezoneWhenEventDetailsHidden)).toBe(true)
    expect(await page.evaluate(() => window.__bookingEvents.filter((event) => event[1] === 'demo_agendada'))).toHaveLength(0)
    await page.evaluate(() => {
      window.__emitCal('bookingSuccessfulV2', { uid: 'test-booking-1' })
      window.__emitCal('bookingSuccessfulV2', { uid: 'test-booking-1' })
    })
    const bookings = await page.evaluate(() => window.__bookingEvents.filter((event) => event[1] === 'demo_agendada'))
    expect(bookings).toHaveLength(1)
    expect(bookings[0][2]).toMatchObject({ plan: 'startup', intent: 'demo', locale })
    await page.evaluate(() => window.__emitCal('linkFailed'))
    const fallback = page.locator('.cal-embed--fallback a')
    await expect(fallback).toBeVisible()
    const url = new URL(await fallback.getAttribute('href'))
    expect(url.searchParams.get('metadata[plan]')).toBe('startup')
    expect(url.searchParams.get('metadata[locale]')).toBe(locale)
    expect(url.searchParams.get('utm_source')).toBe('booking-test')
    await expect(fallback).toHaveAttribute('target', '_blank')
    await expect(page.locator('.cal-embed--fallback')).toContainText(locale === 'es' ? 'formulario de abajo' : 'email form below')
    await page.locator('.cal-panel__form-toggle').click()
    await expect(page.locator('#lead-email')).toBeVisible()
  })
}

for (const route of ['/lp/facturacion-b2b', '/powered-by-relvo']) {
  test(`${route} shares the same secondary email form`, async ({ page }) => {
    await calendarDouble(page)
    await page.goto(base + route)
    await page.locator('.cal-panel__form-toggle').scrollIntoViewIfNeeded()
    await expect(page.locator('#consulta')).not.toHaveAttribute('open')
    await page.locator('.cal-panel__form-toggle').click()
    await expect(page.locator('form input[required]')).toHaveCount(3)
    await expect(page.locator('#lead-cargo, #lead-telefono')).toHaveCount(0)
    await expect(page.locator('form button[type="submit"]')).toHaveText('Enviar consulta')
  })
}

test('Powered by document attribution survives calendar booking, fallback and form prefill', async ({ page }) => {
  await calendarDouble(page)
  const reference = `v1.${'a'.repeat(64)}`
  await page.goto(`${base}/powered-by-relvo?utm_source=prefactura&utm_medium=pdf&utm_campaign=powered_by_relvo&ref=${reference}&surface=invoice_next`)
  await page.locator('.lp-head__ctas a').first().click()
  await expect.poll(() => page.evaluate(() => Boolean(window.__calendarConfig))).toBe(true)
  const config = await page.evaluate(() => window.__calendarConfig)
  expect(JSON.parse(config['metadata[relvo_first_touch]']).reference).toBe(reference)
  expect(JSON.parse(config['metadata[relvo_last_touch]']).surface).toBe('invoice_next')
  await page.locator('.cal-panel__form-toggle').click()
  await page.locator('#lead-nombre').fill('Test Buyer')
  await page.locator('#lead-email').fill('buyer@example.test')
  await page.locator('#lead-email').blur()
  await expect.poll(() => page.evaluate(() => window.__calendarConfig?.email)).toBe('buyer@example.test')
  expect(await page.evaluate(() => window.__calendarConfig.name)).toBe('Test Buyer')
  await page.evaluate(() => window.__emitCal('linkFailed'))
  const fallback = page.locator('.cal-embed--fallback a')
  await expect(fallback).toBeVisible()
  const url = new URL(await fallback.getAttribute('href'))
  expect(JSON.parse(url.searchParams.get('metadata[relvo_first_touch]')).reference).toBe(reference)
  expect(JSON.parse(url.searchParams.get('metadata[relvo_last_touch]')).reference).toBe(reference)
})

test('unrecognized query values never become qualification context', async ({ page }) => {
  await calendarDouble(page)
  await page.goto(`${base}/agendar-demo?plan=unknown&intent=proposal&contact=1`)
  await expect(page.locator('.demo__context')).toHaveCount(0)
  await expect(page.locator('form button[type="submit"]')).toHaveText('Enviar consulta')
  await expect.poll(() => page.evaluate(() => window.__calendarConfig?.['metadata[plan]'])).toBe('undecided')
})

test('mobile calendar can grow to show all slots and booking fields', async ({ page }) => {
  await calendarDouble(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${base}/agendar-demo`)
  await expect.poll(() => page.evaluate(() => Boolean(window.__calendarConfig))).toBe(true)
  await page.locator('div.cal-embed').evaluate((container) => {
    const inline = document.createElement('cal-inline')
    inline.style.cssText = 'height:inherit;min-height:inherit;display:flex;position:relative;flex-wrap:wrap;width:100%'
    const iframe = document.createElement('iframe')
    iframe.className = 'cal-embed'
    iframe.style.cssText = 'height:1100px;width:100%'
    inline.appendChild(iframe)
    container.appendChild(inline)
  })
  const calendar = await page.locator('div.cal-embed').boundingBox()
  const iframe = await page.locator('iframe.cal-embed').boundingBox()
  const email = await page.locator('#consulta').boundingBox()
  expect(iframe.height).toBeGreaterThanOrEqual(1100)
  expect(calendar.height).toBeGreaterThanOrEqual(iframe.height)
  expect(email.y).toBeGreaterThanOrEqual(iframe.y + iframe.height)
})
