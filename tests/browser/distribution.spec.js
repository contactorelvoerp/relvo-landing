import { test, expect } from '@playwright/test'
import fs from 'node:fs/promises'
import path from 'node:path'

const dist = path.resolve('dist')
const reference = `v1.${'a'.repeat(64)}`
const entry = `/powered-by-relvo?utm_source=prefactura&utm_medium=pdf&utm_campaign=powered_by_relvo&utm_content=footer&surface=invoice_next&ref=${reference}&organization_id=private&client_id=private&document_id=private`
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png' }
async function intercept(page) {
  const leads = []; const events = []
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.origin !== 'https://distribution.test') return route.fulfill({ contentType: 'text/javascript', body: '' })
    if (url.pathname === '/api/distribution-event') {
      events.push(route.request().postDataJSON())
      return route.fulfill({ status: 204 })
    }
    if (url.pathname === '/api/lead') {
      leads.push(route.request().postDataJSON())
      return route.fulfill({ status: leads.length === 1 ? 502 : 200, contentType: 'application/json', body: JSON.stringify(leads.length === 1 ? { error: 'temporary' } : { ok: true, duplicate: true, recorded: true }) })
    }
    let filename = path.join(dist, url.pathname)
    if (!path.extname(filename)) filename = path.join(filename, 'index.html')
    try { return await route.fulfill({ contentType: types[path.extname(filename)] ?? 'application/octet-stream', body: await fs.readFile(filename) }) }
    catch { return route.fulfill({ status: 404, body: 'Not found' }) }
  })
  return { leads, events }
}

test('PDF campaign survives demo navigation, validation and a retry without a false conversion', async ({ page }) => {
  const { leads, events } = await intercept(page)
  const errors = []; page.on('pageerror', (error) => errors.push(error.message))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(`https://distribution.test${entry}`)
  await expect(page.locator('h1')).toHaveText('Powered by Relvo')
  await expect.poll(() => events.length).toBeGreaterThan(0)
  expect(page.url()).not.toContain('private')
  const config = await page.evaluate(() => Array.from(window.dataLayer.find((item) => item[0] === 'config')))
  expect(config[2].page_location).not.toContain('ref=')
  expect(config[2].page_location).not.toContain('private')
  await expect(page.locator('.hero-stage .hc--in')).toHaveCount(4)
  await page.screenshot({ path: 'test-results/powered-by-desktop.png', fullPage: true })
  await page.locator('main .lp-head__ctas a').click()
  await expect(page).toHaveURL('https://distribution.test/agendar-demo')
  await page.getByRole('button', { name: 'Enviar', exact: true }).click()
  expect(leads).toHaveLength(0)
  await page.locator('input[name="nombre"]').fill('Test Person')
  await page.locator('input[name="email"]').fill('person@example.test')
  await page.locator('input[name="empresa"]').fill('Test Company')
  await page.locator('select[name="cargo"]').selectOption('RevOps')
  await page.getByRole('button', { name: 'Enviar', exact: true }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  const beforeRetry = await page.evaluate(() => window.dataLayer.filter((item) => item[0] === 'event' && item[1] === 'generate_lead').length)
  expect(beforeRetry).toBe(0)
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Te contactamos pronto')
  expect(leads).toHaveLength(2)
  expect(leads[0].submission_id).toBe(leads[1].submission_id)
  expect(leads[1].attribution.first_touch.reference).toBe(reference)
  expect(leads[1].attribution.last_touch.reference).toBe(reference)
  const conversions = await page.evaluate(() => window.dataLayer.filter((item) => item[0] === 'event' && item[1] === 'generate_lead').map((item) => Array.from(item)))
  expect(conversions).toHaveLength(1)
  expect(conversions[0][2].distribution_channel).toBe('powered_by_relvo')
  expect(JSON.stringify(conversions)).not.toMatch(/person@example|Test Person|Test Company|v1\./)
  expect(events.map((item) => item.event_name)).toEqual(expect.arrayContaining(['powered_by_landing', 'powered_by_demo_click', 'powered_by_form_start']))
  expect(errors).toEqual([])
})

test('English mobile landing has no placeholders, overflows or motion requirement', async ({ page }) => {
  await intercept(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('https://distribution.test/en/powered-by-relvo')
  await expect(page.locator('h1')).toHaveText('Powered by Relvo')
  await expect(page.locator('body')).not.toContainText('[PENDIENTE]')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/powered-by-mobile-en.png', fullPage: true })
  await expect(page.locator('main a')).toHaveAttribute('href', '/en/book-a-demo')
})


test('Spanish mobile product visual respects reduced motion without horizontal overflow', async ({ page }) => {
  await intercept(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('https://distribution.test/powered-by-relvo')
  await expect(page.locator('.hero-stage .hc--in')).toHaveCount(4)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await expect(page.locator('body')).not.toContainText('[PENDIENTE]')
  await page.screenshot({ path: 'test-results/powered-by-mobile-es.png', fullPage: true })
})
