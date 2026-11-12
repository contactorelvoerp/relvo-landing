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

for (const locale of ['es', 'en']) {
  for (const width of [320, 390, 768, 1440]) {
    test(`${locale} landing keeps logos and feature panels readable at ${width}px without motion`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(base + (locale === 'es' ? '/' : '/en'))
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator('h1')).toHaveCount(1)
      const logos = page.locator('.logo-strip__group:not([aria-hidden]) img')
      await expect(logos).toHaveCount(8)
      for (const logo of await logos.all()) {
        const box = await logo.boundingBox()
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(width)
      }
      const tabs = page.locator('#rieles [role="tab"]')
      await tabs.first().focus()
      for (let i = 0; i < 4; i++) {
        await expect(tabs.nth(i)).toHaveAttribute('aria-selected', 'true')
        const panel = page.locator('#rieles [role="tabpanel"]:visible')
        await expect(panel).toHaveCount(1)
        await expect(panel).toHaveAttribute('aria-labelledby', await tabs.nth(i).getAttribute('id'))
        const fits = await panel.evaluate((el) => [el, ...el.querySelectorAll('*')].every((child) => {
          const rect = child.getBoundingClientRect()
          return !rect.width || (rect.left >= 0 && rect.right <= innerWidth + 1)
        }))
        expect(fits).toBe(true)
        if (i < 3) await page.keyboard.press('ArrowDown')
      }
      await page.keyboard.press('Tab')
      await expect(page.locator('#rieles [role="tabpanel"]:visible')).toBeFocused()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    })
  }
}

test('desktop menus support keyboard entry, Escape, focus exit and outside dismissal', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(base)
  const trigger = page.locator('[aria-controls="nav-product"]')
  await trigger.focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('#nav-product a').first()).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await page.keyboard.press('Enter')
  await page.locator('.hero__subtitle').click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await trigger.focus()
  await page.keyboard.press('ArrowDown')
  await page.locator('.hero__ctas a').first().focus()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
})

test('mobile navigation closes after an anchor and restores focus on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(base)
  const trigger = page.locator('[aria-controls="nav-mobile"]')
  await trigger.click()
  await page.locator('#nav-mobile a').first().focus()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(page.locator('#nav-mobile')).toBeHidden()
  await trigger.click()
  await page.locator('#nav-mobile a[href$="#clientes"]').click()
  await expect(page).toHaveURL(/#clientes$/)
  await expect(page.locator('#nav-mobile')).toBeHidden()
})

for (const locale of ['es', 'en']) {
  test(`${locale} mobile charts keep readable labels and support keyboard scrolling`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(base + (locale === 'es' ? '/' : '/en'))
    const tabs = page.locator('#inteligencia [role="tab"]')
    await tabs.first().focus()
    // Vertical arrows keep their normal page-scrolling behavior on horizontal tabs.
    await page.keyboard.press('ArrowDown')
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true')
    for (let i = 0; i < 3; i++) {
      await tabs.nth(i).click()
      const panel = page.locator('#inteligencia [role="tabpanel"]:visible')
      await expect(panel.locator('.report__hint')).toBeVisible()
      const chart = panel.getByRole('region')
      await chart.focus()
      const size = await chart.evaluate((el) => ({ view: el.clientWidth, full: el.scrollWidth }))
      expect(size.full).toBeGreaterThan(size.view)
      expect(await chart.locator('svg').evaluate((svg) => svg.getBoundingClientRect().width)).toBe(640)
      await page.keyboard.press('ArrowRight')
      await expect.poll(() => chart.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })

  test(`${locale} keyboard visitors can skip the navigation`, async ({ page }) => {
    await page.goto(base + (locale === 'es' ? '/' : '/en'))
    await page.keyboard.press('Tab')
    const link = page.getByRole('link', { name: locale === 'es' ? 'Saltar al contenido' : 'Skip to content' })
    await expect(link).toBeFocused()
    await expect(link).toBeInViewport()
    await page.keyboard.press('Enter')
    await expect(page.locator('main')).toBeFocused()
  })
}

test('keyboard menus remain open when the pointer leaves, and reset across breakpoints', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(base)
  const trigger = page.locator('[aria-controls="nav-product"]')
  await trigger.hover()
  await trigger.focus()
  await page.keyboard.press('ArrowDown')
  await page.mouse.move(700, 800)
  await expect(page.locator('#nav-product a').first()).toBeFocused()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await page.setViewportSize({ width: 390, height: 900 })
  const mobile = page.locator('[aria-controls="nav-mobile"]')
  await expect(mobile).toHaveAttribute('aria-expanded', 'false')
  await mobile.click()
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.setViewportSize({ width: 390, height: 900 })
  await expect(mobile).toHaveAttribute('aria-expanded', 'false')
})

test('tablet product grid uses two columns without clipping card content', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 })
  await page.goto(base)
  await page.evaluate(() => document.fonts.ready)
  const cards = await page.locator('.bento .product').evaluateAll((items) => items.map((item) => {
    const rect = item.getBoundingClientRect()
    return { x: rect.x, y: rect.y, right: rect.right, fits: item.scrollWidth <= item.clientWidth }
  }))
  expect(cards[0].y).toBe(cards[1].y)
  expect(cards[1].x).toBeGreaterThan(cards[0].x)
  expect(cards.every((card) => card.fits && card.right <= 768)).toBe(true)
})

test('desktop reports keep all chart labels and legends inside the panel', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(base)
  await page.evaluate(() => document.fonts.ready)
  const tabs = page.locator('#inteligencia [role="tab"]')
  for (const tab of await tabs.all()) {
    await tab.click()
    const panel = page.locator('#inteligencia [role="tabpanel"]:visible')
    expect(await panel.evaluate((el) => {
      const bottom = el.getBoundingClientRect().bottom
      return [...el.querySelectorAll('svg,.legend')].every((item) => item.getBoundingClientRect().bottom <= bottom)
    })).toBe(true)
  }
})

test('visible texture and engine respond to motion preference changes without a reload', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(base)
  const canvas = page.locator('.cta canvas')
  await canvas.scrollIntoViewIfNeeded()
  const snapshot = () => canvas.evaluate((el) => el.toDataURL())
  const first = await snapshot()
  await expect.poll(snapshot).not.toBe(first)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  // A reduced-motion texture stays on its static frame across multiple paint intervals.
  await page.waitForTimeout(100)
  const still = await snapshot()
  await page.waitForTimeout(150)
  expect(await snapshot()).toBe(still)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect.poll(snapshot).not.toBe(still)
  await page.locator('.layers').scrollIntoViewIfNeeded()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('[data-k="mrr"]')).toHaveText('USD 187.200')
  await expect(page.locator('[data-k="chipText"]')).toHaveText('Listo')
})
