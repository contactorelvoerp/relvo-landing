import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { createServer } from 'vite'

// Exercise Vite's development module loader, where circular initialization can
// fail even when the bundled production build succeeds.
test('SSR routes and pages initialize concurrently on cold loads and reloads', { timeout: 60000 }, async () => {
  const server = await createServer({ server: { middlewareMode: true }, logLevel: 'silent' })
  const template = await fs.readFile(new URL('../index.html', import.meta.url), 'utf8')
  try {
    for (let reload = 0; reload < 3; reload++) {
      server.moduleGraph.invalidateAll()
      const [router, renderer, registry, manifest] = await Promise.all([
        server.ssrLoadModule('/src/routes.js'),
        server.ssrLoadModule('/src/entry-server.jsx'),
        server.ssrLoadModule('/src/pages/registry.js'),
        server.ssrLoadModule('/src/pages/manifest.js'),
      ])
      assert.deepEqual(Object.keys(registry.PAGE_COMPONENTS).sort(), Object.keys(manifest.PAGE_DEFINITIONS).sort())
      for (const [id, component] of Object.entries(registry.PAGE_COMPONENTS)) assert.equal(typeof component, 'function', id)
      const routes = router.getRoutes()
      assert.equal(new Set(routes.map((route) => route.path)).size, routes.length)
      for (const route of routes.filter((route) => route.status === 'live')) {
        assert.equal(router.resolvePath(route.path).id, route.id)
        const html = renderer.renderDocument(template, route, { production: false })
        assert.ok(html.includes(`data-route="${route.id}:${route.locale}"`), route.path)
        assert.equal((html.match(/<h1\b/g) ?? []).length, 1, route.path)
        if (route.path === '/' || route.path === '/en') {
          assert.match(html, /href="https:\/\/app.getrelvo.ai\/login"/)
          assert.match(html, /href="https:\/\/app.getrelvo.ai\/privacy"/)
          assert.match(html, /href="https:\/\/app.getrelvo.ai\/terms"/)
          assert.match(html, /class="footer__google-signin"/)
          assert.match(html, /Gmail, Drive, Calendar/)
          assert.doesNotMatch(html, /app\.relvoerp\.com\/(privacy|terms)/)
        }
      }
      for (const pathname of ['/precios', '/en/pricing', '/producto/contratos-y-pricing', '/en/product/contracts-and-pricing']) {
        assert.equal(router.resolvePath(pathname).status, 'live', pathname)
      }
      assert.equal(router.resolvePath('/en/solutions/recurring-plans').status, '404')
      assert.equal(router.resolvePath('/missing-page').status, '404')
    }
  } finally {
    await server.close()
  }
})
