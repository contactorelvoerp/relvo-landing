import { test, expect } from '@playwright/test'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

let server, base
const dist = path.resolve('dist')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png' }
test.beforeAll(async () => {
  server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    let file = path.join(dist, url.pathname)
    if (!path.extname(file)) file = path.join(file, 'index.html')
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end('Not found') }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' })
    fs.createReadStream(file).pipe(res)
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  base = `http://127.0.0.1:${server.address().port}`
})
test.afterAll(async () => { await new Promise((resolve) => server.close(resolve)) })

for (const locale of ['es', 'en']) {
  const route = locale === 'es' ? '/precios' : '/en/pricing'
  for (const width of [320, 390, 768, 1440]) {
    test(`${locale} pricing comparison and context work at ${width}px with reduced motion`, async ({ page }) => {
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(base + route)
      await expect(page.locator('h1')).toHaveCount(1)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      if (width <= 390) {
        await expect(page.locator('.pr-summary')).toBeInViewport()
        await expect(page.locator('.pr-summary a')).toHaveCount(2)
        await page.locator('.pr-summary a').last().click()
        await expect(page.locator('#plan-custom')).toBeInViewport()
      }
      // Keep the comparison concise until a visitor asks for an explanation.
      await expect(page.locator('.pr-plan .pr-feature')).toHaveCount(0)
      await expect(page.locator('#pr-shared-title')).toHaveText(locale === 'es' ? 'Incluido en ambos planes' : 'Included in both plans')
      const features = page.locator('.pr-shared .pr-feature')
      await expect(features).toHaveCount(10)
      const firstFeature = features.first()
      await expect(firstFeature.locator('.pr-feature__detail')).not.toBeVisible()
      await firstFeature.locator('summary').focus()
      await firstFeature.locator('summary').press('Enter')
      await expect(firstFeature.locator('.pr-feature__detail')).toBeVisible()
      await expect(firstFeature.getByRole('link')).toHaveAttribute('href', locale === 'es' ? '/producto/contratos-y-pricing' : '/en/product/contracts-and-pricing')
      await firstFeature.locator('summary').press('Enter')
      await expect(firstFeature.locator('.pr-feature__detail')).not.toBeVisible()
      const recognition = features.filter({ has: page.locator('summary', { hasText: 'IFRS 15' }) })
      await recognition.locator('summary').click()
      await expect(recognition.locator('.pr-feature__detail')).toContainText('IFRS 15')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await recognition.locator('summary').click()
      const mcp = features.filter({ has: page.locator('summary', { hasText: 'MCP' }) })
      await mcp.locator('summary').click()
      await expect(mcp.locator('.pr-feature__detail')).toContainText('Model Context Protocol')
      await expect(mcp.getByRole('link')).toHaveAttribute('href', locale === 'es' ? '/producto/agentes' : '/en/product/agents')
      await mcp.locator('summary').click()
      const agents = features.filter({ has: page.locator('summary', { hasText: locale === 'es' ? 'Agentes de IA' : 'AI agents' }) })
      await agents.locator('summary').click()
      await expect(agents.locator('.pr-feature__detail')).toContainText('Google Chat')
      await agents.locator('summary').click()
      const demoPath = locale === 'es' ? '/agendar-demo' : '/en/book-a-demo'
      await expect(page.locator('#plan-startup .pr-plan__cta')).toHaveAttribute('href', `${demoPath}?plan=startup`)
      await expect(page.locator('.pr-contact__actions .btn')).toHaveAttribute('href', demoPath)
      await expect(page.locator('.pr-contact__email')).toHaveAttribute('href', `${demoPath}?contact=1#consulta`)
      await expect(page.locator('.pr-contact form')).toHaveCount(0)
      await page.locator('#plan-custom .pr-plan__cta').click()
      await expect(page).toHaveURL(`${base}${demoPath}?plan=custom&intent=proposal&contact=1#consulta`)
      await expect(page.locator('.demo__context')).toContainText(locale === 'es' ? 'A medida' : 'Custom')
      await expect(page.locator('#pricing-plan')).toHaveCount(0)
      await expect(page.locator('#consulta')).toHaveAttribute('open', '')
      await expect(page.locator('form button[type="submit"]')).toHaveText(locale === 'es' ? 'Solicitar propuesta' : 'Request a proposal')
      await expect(page.locator('#lead-cargo')).toHaveCount(0)
      await expect(page.locator('#lead-telefono')).toHaveCount(0)
      await page.locator('#lead-nombre').fill('Test Buyer')
      await page.locator('form button[type="submit"]').click()
      await expect(page.locator('#lead-email')).toBeFocused()
      await expect(page.locator('#lead-email')).toHaveAttribute('aria-invalid', 'true')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      expect(errors).toEqual([])
    })
  }

  test(`${locale} pricing submits context, keeps retry identity and records one lead`, async ({ page }) => {
    const requests = []
    await page.route('**/api/lead', async (route) => {
      requests.push(route.request().postDataJSON())
      await route.fulfill({ status: requests.length === 1 ? 502 : 200, contentType: 'application/json', body: requests.length === 1 ? '{"error":"Temporary failure"}' : '{"ok":true,"recorded":true}' })
    })
    // If a site key is configured locally, fake only the browser widget. No real
    // verification or lead request leaves this test browser.
    await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', (route) => route.fulfill({ contentType: 'text/javascript', body: 'window.turnstile={render:(el,opts)=>{window.__testToken=opts.callback;setTimeout(()=>opts.callback("test-token"),0);return "test-widget"},reset:()=>{setTimeout(()=>window.__testToken("test-token"),0)}};' }))
    await page.goto(`${base}${route}?utm_source=pricing-test`)
    await page.evaluate(() => {
      window.__RELVO_ANALYTICS__ = {}
      window.__pricingEvents = []
      window.gtag = (...args) => window.__pricingEvents.push(args)
    })
    await page.locator('#plan-startup .pr-plan__cta').click()
    await page.locator('.cal-panel__form-toggle').click()
    await page.evaluate(() => { window.__RELVO_ANALYTICS__ = {}; window.__pricingEvents = []; window.gtag = (...args) => window.__pricingEvents.push(args) })
    await page.locator('#lead-nombre').fill('Test Buyer')
    await page.locator('#lead-email').fill('buyer@example.com')
    await page.locator('#lead-empresa').fill('Test Company')
    // Three required fields suffice; the message is optional.
    await page.locator('form button[type="submit"]').click()
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page.locator('#lead-email')).toHaveValue('buyer@example.com')
    await page.locator('form button[type="submit"]').click()
    await expect(page.locator('.demo__success[role="status"]')).toBeVisible()
    expect(requests).toHaveLength(2)
    expect(requests[0].submission_id).toBe(requests[1].submission_id)
    expect(requests[1]).toMatchObject({ nombre: 'Test Buyer', email: 'buyer@example.com', empresa: 'Test Company', cargo: 'Otro', fuente: 'agendar_demo', problema: 'Plan: startup\nRequest: demo' })
    expect(JSON.stringify(requests[1].attribution)).toContain('pricing-test')
    const conversions = await page.evaluate(() => window.__pricingEvents.filter((event) => event[1] === 'generate_lead'))
    expect(conversions).toHaveLength(1)
    expect(conversions[0][2]).toMatchObject({ plan: 'startup', intent: 'demo', locale })
    expect(JSON.stringify(conversions)).not.toContain('buyer@example.com')
    expect(await page.evaluate(() => window.__pricingEvents.filter((event) => event[1] === 'demo_agendada'))).toHaveLength(0)
  })
}
