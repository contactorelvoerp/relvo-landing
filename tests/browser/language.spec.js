import { test, expect } from '@playwright/test'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { languageDecision } from '../../shared/language.js'

let server, base
const dist = path.resolve('dist')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png' }
test.beforeAll(async () => {
  server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const decision = languageDecision(new Request(url, { method: req.method, headers: req.headers }))
    if (decision?.cookie) res.setHeader('Set-Cookie', decision.cookie)
    if (decision?.location) { res.writeHead(307, { Location: decision.location }); return res.end() }
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

for (const width of [1440, 390, 320]) {
  test(`language switch fits at ${width}px, remembers choices and preserves attribution`, async ({ page, context }) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.setViewportSize({ width, height: 900 })
    await context.setExtraHTTPHeaders({ 'x-vercel-ip-country': 'US' })
    await page.goto(`${base}/?lang=es&utm_source=language-test`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.locator('.language-switch:visible')).toHaveCount(1)
    const english = page.getByRole('link', { name: 'EN — English', exact: true }).filter({ visible: true })
    await expect(english).toBeInViewport()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const navFits = await page.locator('.nav__bar:visible').evaluate((nav) => {
      const items = [...nav.querySelectorAll('.nav__actions > *')].map((item) => item.getBoundingClientRect())
      return items.every((item, i) => item.right <= innerWidth && (!i || item.left >= items[i - 1].right))
    })
    expect(navFits).toBe(true)
    await page.evaluate(() => history.replaceState(null, '', `${location.href}#clientes`))
    await english.click()
    await expect(page).toHaveURL(`${base}/en?lang=en&utm_source=language-test`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('body')).not.toContainText('[PENDIENTE]')
    await expect(page.locator('h1')).toHaveText('Your billing and collections, on autopilot.')
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await page.goto(`${base}/`)
    await expect(page).toHaveURL(`${base}/en`)
    await page.evaluate(() => history.replaceState(null, '', `${location.href}#clientes`))
    await page.getByRole('link', { name: 'ES — Español', exact: true }).filter({ visible: true }).click()
    await expect(page).toHaveURL(`${base}/?lang=es`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await page.goto(`${base}/`)
    await expect(page).toHaveURL(`${base}/`)
    expect(errors).toEqual([])
  })
}

const products = [
  ['contracts-and-pricing', 'contratos-y-pricing', 'Quote to contract', 'Contracts and pricing: any model, turned into exact rules.'],
  ['usage-metering', 'medicion-del-consumo', 'Usage-based billing', "Usage metering: your customers' usage, ready to bill."],
  ['approvals-and-purchase-orders', 'aprobaciones-y-ordenes-de-compra', 'Purchase orders and approvals', 'Approvals and purchase orders: no invoice goes out without its PO.'],
  ['accounts-receivable', 'cuentas-por-cobrar', 'Billing and collections', 'Invoice, collect and reconcile without a spreadsheet.'],
  ['agents', 'agentes', 'AI agents', 'AI agents that handle the manual work of collections.'],
  ['reporting', 'reporteria', 'Revenue reporting', 'SaaS/AI reporting: your revenue metrics, without spreadsheets.'],
]

for (const width of [1440, 390]) {
  test(`English pricing is reachable, translated and switches languages at ${width}px`, async ({ page }) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.setViewportSize({ width, height: 900 })
    await page.goto(`${base}/en?lang=en`)
    if (width < 768) {
      await page.locator('.nav__bar:visible').getByRole('button', { name: 'Menu', exact: true }).click()
    }
    await page.locator('.nav a[href="/en/pricing"]:visible').click()
    await expect(page).toHaveURL(`${base}/en/pricing`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('h1')).toHaveText('Your billing and collections, in one plan.')
    await expect(page.locator('.pr-plan__amount')).toHaveText(['USD 299', "Let's talk"])
    await expect(page.locator('.pr-plan__period')).toHaveText('/ month')
    await expect(page.locator('.pr-plan__name')).toHaveText(['Business', 'Custom'])
    await expect(page.locator('.pr-plan__limits dd')).toHaveText(['Up to 50', '1', '1', 'More than 50', 'Multiple', 'Multiple'])
    await expect(page.getByRole('link', { name: 'Request a proposal', exact: true })).toBeVisible()
    await expect(page.locator('.pr-faq details').filter({ hasNot: page.locator('.pending__tag') }).locator('summary')).toHaveText([
      'What is a contract in Relvo?',
      'What happens if I exceed 50 contracts?',
      'Does Relvo process card payments?',
    ])
    await page.locator('.pr-faq summary').first().click()
    await expect(page.locator('.pr-faq details').first()).toHaveAttribute('open', '')
    await expect(page.locator('body')).not.toContainText(/Precios claros|Agendar una demo|A medida|¿|Preguntas frecuentes/)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.getByRole('link', { name: 'ES — Español', exact: true }).filter({ visible: true }).click()
    await expect(page).toHaveURL(`${base}/precios?lang=es`)
    await expect(page.locator('h1')).toHaveText('Tu facturación y cobranza, en un solo plan.')
    await page.getByRole('link', { name: 'EN — English', exact: true }).filter({ visible: true }).click()
    await expect(page).toHaveURL(`${base}/en/pricing?lang=en`)
    await expect(page.locator('h1')).toHaveText('Your billing and collections, in one plan.')
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    expect(errors).toEqual([])
  })

  for (const [slug, spanishSlug, name, heading] of products) {
    test(`English ${name} is reachable and switches to the same product at ${width}px`, async ({ page }) => {
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`${base}/en?lang=en`)
      const nav = page.locator('.nav__bar:visible')
      if (width < 768) {
        await nav.getByRole('button', { name: 'Menu', exact: true }).click()
      } else {
        await nav.getByRole('button', { name: 'Product', exact: true }).click()
      }
      const productLink = page.locator(`.nav a[href="/en/product/${slug}"]:visible`)
      await expect(productLink).toContainText(name)
      await productLink.click()
      await expect(page).toHaveURL(`${base}/en/product/${slug}`)
      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
      await expect(page.locator('h1')).toHaveText(heading)
      await expect(page.locator('.lp-head__ctas a').first()).toHaveAttribute('href', '/en/book-a-demo')
      await expect(page.locator('.related a')).toHaveCount(3)
      for (const link of await page.locator('.related a').all()) {
        await expect(link).toHaveAttribute('href', /^\/en\/product\//)
      }
      await expect(page.locator('.crumbs a').first()).toHaveAttribute('href', '/en')
      await expect(page.locator('body')).not.toContainText(/Preguntas frecuentes|Cómo funciona|Agendar demo|\[PENDIENTE\]/)
      if (slug === 'accounts-receivable') {
        await expect(page.getByText('less operational time', { exact: true })).toBeVisible()
      }
      await page.getByRole('link', { name: 'ES — Español', exact: true }).filter({ visible: true }).click()
      await expect(page).toHaveURL(`${base}/producto/${spanishSlug}?lang=es`)
      await expect(page.locator('html')).toHaveAttribute('lang', 'es')
      await page.getByRole('link', { name: 'EN — English', exact: true }).filter({ visible: true }).click()
      await expect(page).toHaveURL(`${base}/en/product/${slug}?lang=en`)
      await expect(page.locator('h1')).toHaveText(heading)
      expect(errors).toEqual([])
    })
  }
}
