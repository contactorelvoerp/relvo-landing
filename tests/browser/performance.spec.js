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

test('home loads its own JavaScript within budget and does not download booking or campaign code', async ({ page }) => {
  const scripts = new Set()
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.endsWith('.js')) scripts.add(request.url())
  })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.locator('#rieles [role="tab"]').nth(1).click()
  await expect(page.locator('#rieles [role="tab"]').nth(1)).toHaveAttribute('aria-selected', 'true')
  expect([...scripts].some((url) => /HomePage-/.test(url))).toBe(true)
  expect([...scripts].some((url) => /(?:DemoPage|PricingPage|LandingAdsPage|PoweredByPage|CalEmbed)-/.test(url))).toBe(false)
  const bytes = await page.evaluate(() => {
    const sizes = new Map(performance.getEntriesByType('resource').filter((entry) => new URL(entry.name).pathname.endsWith('.js')).map((entry) => [entry.name, entry.decodedBodySize]))
    return [...sizes.values()].reduce((sum, size) => sum + size, 0)
  })
  expect(bytes).toBeGreaterThan(0)
  expect(bytes).toBeLessThan(270_000)
  expect(errors).toEqual([])
})

for (const route of ['/', '/en', '/precios', '/producto/contratos-y-pricing']) {
  test(`${route} has complete, styled content before JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    const response = await page.goto(base + route)
    expect(response.status()).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toBeVisible()
    expect(await page.locator('h1').evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThan(30)
    expect(await page.locator('h1').evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Fujiwara|Instrument/)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await context.close()
  })
}

test('phone navigation has 44px touch targets without overlap at 320px', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 844 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  await page.goto(base)
  const controls = page.locator('.nav__bar--mobile .nav__actions a,.nav__burger')
  const boxes = await controls.evaluateAll((items) => items.map((el) => {
    const rect = el.getBoundingClientRect()
    return { left: rect.left, right: rect.right, width: rect.width, height: rect.height }
  }))
  expect(boxes).toHaveLength(4)
  boxes.forEach((box, i) => {
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
    expect(box.right).toBeLessThanOrEqual(320)
    if (i) expect(box.left).toBeGreaterThanOrEqual(boxes[i - 1].right)
  })
  await page.locator('.nav__burger').tap()
  await expect(page.locator('#nav-mobile')).toBeVisible()
  await context.close()
})

test('native contact disclosure works with the keyboard across breakpoints', async ({ page }) => {
  await page.route('https://cal.com/**', (route) => route.abort())
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${base}/agendar-demo`)
  const details = page.locator('.cal-panel__form')
  const toggle = details.locator('summary')
  await expect(details).not.toHaveAttribute('open')
  await expect(page.locator('.cal-panel__form-body')).toBeHidden()
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(details).toHaveAttribute('open', '')
  await expect(page.locator('.cal-panel__form-body')).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(details).toHaveAttribute('open', '')
  await expect(page.locator('#lead-email')).toHaveAttribute('required', '')
  await toggle.click()
  await expect(details).not.toHaveAttribute('open')
  await expect(page.locator('.cal-panel__form-body')).toBeHidden()
})

test('successful contact submission moves focus to the confirmation', async ({ page }) => {
  await page.route('**/api/lead', (route) => route.fulfill({ contentType: 'application/json', body: '{"ok":true,"recorded":true}' }))
  await page.route('https://cal.com/**', (route) => route.abort())
  await page.goto(`${base}/en/book-a-demo?contact=1`)
  await page.locator('#lead-nombre').fill('Test Buyer')
  await page.locator('#lead-email').fill('buyer@example.test')
  await page.locator('#lead-empresa').fill('Test Company')
  await page.locator('form button[type="submit"]').click()
  await expect(page.locator('.demo__success')).toBeFocused()
})
