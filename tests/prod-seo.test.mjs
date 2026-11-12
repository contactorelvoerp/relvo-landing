import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import fs from 'node:fs'
import { spawn } from 'node:child_process'
import { languageDecision } from '../shared/language.js'

test('production SEO audit checks canonical pages from a non-Spanish region', async () => {
  const site = 'https://getrelvo.ai'
  const { redirects } = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
  const fixed = redirects.filter((rule) => !rule.has && !rule.source.includes(':'))
  const pageRequests = []
  const server = http.createServer((req, res) => {
    const pathname = new URL(req.url, site).pathname
    if (pathname === '/sitemap.xml') {
      res.setHeader('Content-Type', 'application/xml')
      return res.end(`<urlset><url><loc>${site}/</loc></url><url><loc>${site}/en</loc></url></urlset>`)
    }
    const redirect = fixed.find((rule) => rule.source === pathname)
    if (redirect) {
      res.writeHead(301, { Location: redirect.destination })
      return res.end()
    }
    // Match the live entry-point middleware, with a US IP like GitHub Actions.
    const decision = languageDecision(new Request(site + req.url, {
      headers: { 'user-agent': req.headers['user-agent'] ?? '', 'x-vercel-ip-country': 'US' },
    }))
    if (decision?.location) {
      res.writeHead(307, { Location: decision.location })
      return res.end()
    }
    pageRequests.push(pathname)
    res.setHeader('Content-Type', 'text/html')
    res.end(`<html><head><meta name="robots" content="index, follow"><link rel="canonical" href="${site}${pathname}"></head></html>`)
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  try {
    const result = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [new URL('../scripts/check-prod-seo.mjs', import.meta.url).pathname, `http://127.0.0.1:${server.address().port}`])
      let output = ''
      child.stdout.on('data', (data) => { output += data })
      child.stderr.on('data', (data) => { output += data })
      child.on('error', reject)
      child.on('close', (code) => resolve({ code, output }))
    })
    assert.equal(result.code, 0, result.output)
    assert.match(result.output, /2 URLs indexables/)
    assert.deepEqual(pageRequests, ['/', '/en'])
    // Ordinary visitors still get the intended localized destination.
    assert.equal(languageDecision(new Request(site, { headers: { 'user-agent': 'Mozilla/5.0', 'x-vercel-ip-country': 'US' } })).location, `${site}/en`)
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})
