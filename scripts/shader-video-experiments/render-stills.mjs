#!/usr/bin/env node
/**
 * render-stills.mjs
 *
 * Stage 1: render N hero-viewport candidate stills at u_time = 0, 2000, …
 * Stage 2 (--final): after picking a winner, re-render the winner at the
 * full landing scroll height and crop into viewport-sized slot images
 * with 200px bleed between adjacent slots.
 *
 * Usage:
 *   # Stage 1 — candidates for hero frame selection
 *   node scripts/shader-video-experiments/render-stills.mjs
 *
 *   # Stage 2 — final render of chosen frame, cropped into slot webps
 *   node scripts/shader-video-experiments/render-stills.mjs --final --frame=6000 --scrollH=8000
 *
 * Flags:
 *   --width=2560        candidate and slot width
 *   --height=1440       candidate (hero viewport) height
 *   --port=5179         vite dev server port
 *   --final             run stage 2 instead of stage 1
 *   --frame=N           u_time (ms) of winning frame (stage 2 only)
 *   --scrollH=8000      total landing scroll height for the full canvas (stage 2)
 *   --slotH=1440        logical viewport slot height (stage 2)
 *   --bleed=200         overlap in px between adjacent slots (stage 2)
 *   --out=/tmp/shader-stills   intermediate output dir
 *
 * Requires vite dev server; the script starts one and kills it on exit.
 * Opens non-headless Chromium so WebGL uses the real GPU.
 */

import { spawn } from 'node:child_process'
import { mkdir, rm, readdir } from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  })
)

const WIDTH   = parseInt(args.width   ?? '2560', 10)
const HEIGHT  = parseInt(args.height  ?? '1440', 10)
const PORT    = parseInt(args.port    ?? '5179', 10)
const FINAL   = args.final === true
const FRAME   = parseInt(args.frame   ?? '0', 10)
const SCROLLH = parseInt(args.scrollH ?? '8000', 10)
const SLOTH   = parseInt(args.slotH   ?? '1440', 10)
const BLEED   = parseInt(args.bleed   ?? '200', 10)
const OUT_DIR = args.out ?? '/tmp/shader-stills'

function log(m) { process.stdout.write(`[stills] ${m}\n`) }

function run(cmd, cmdArgs, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, cmdArgs, { stdio: 'inherit', ...opts })
    p.on('error', reject)
    p.on('exit', (c) => c === 0 ? resolve() : reject(new Error(`${cmd} exited ${c}`)))
  })
}

function startVite() {
  log(`starting vite on port ${PORT}...`)
  const proc = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    cwd: process.cwd(),
  })
  return new Promise((resolve, reject) => {
    let ready = false
    const onData = (buf) => {
      const s = buf.toString()
      process.stdout.write(`  vite: ${s}`)
      if (!ready && (s.includes('ready in') || s.includes('Local:'))) {
        ready = true
        resolve(proc)
      }
    }
    proc.stdout.on('data', onData)
    proc.stderr.on('data', onData)
    proc.on('error', reject)
    proc.on('exit', (c) => { if (!ready) reject(new Error(`vite exited ${c}`)) })
    setTimeout(() => { if (!ready) reject(new Error('vite not ready in 30s')) }, 30_000)
  })
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true })
  await mkdir(OUT_DIR, { recursive: true })

  const vite = await startVite()
  let browser

  try {
    log('launching chromium (real GPU)...')
    // Canvas is bigger than window for stage 2 — Puppeteer clips to the
    // window, so the window has to be big enough to fit the canvas.
    // Modern GPUs handle 2560×8000 fine in a window. Chromium's canvas
    // internally may clamp to the OS display size but our defaultViewport
    // overrides that.
    const canvasW = WIDTH
    const canvasH = FINAL ? SCROLLH : HEIGHT
    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--window-size=${canvasW},${Math.min(canvasH, 2000)}`,
        '--enable-webgl',
        '--ignore-gpu-blocklist',
        '--disable-background-timer-throttling',
      ],
      defaultViewport: { width: canvasW, height: canvasH, deviceScaleFactor: 1 },
    })

    const page = await browser.newPage()
    page.on('pageerror', (e) => log(`  page error: ${e.message}`))

    const url = `http://localhost:${PORT}/render-shader?w=${canvasW}&h=${canvasH}`
    log(`opening ${url}`)
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30_000 })
    await page.waitForFunction(() => window.__shaderReady === true, { timeout: 15_000 })

    const canvasHandle = await page.waitForSelector('#render-root canvas', { timeout: 15_000 })
    const box = await canvasHandle.boundingBox()
    log(`canvas bbox: ${JSON.stringify(box)}`)
    if (!box || Math.abs(box.width - canvasW) > 2) {
      throw new Error(`canvas width ${box?.width} != target ${canvasW}`)
    }
    if (Math.abs(box.height - canvasH) > 2) {
      throw new Error(`canvas height ${box?.height} != target ${canvasH}`)
    }

    if (!FINAL) {
      // ── Stage 1: candidates ─────────────────────────────────────────
      const frames = []
      for (let ms = 0; ms <= 28000; ms += 2000) frames.push(ms)
      log(`stage 1 — rendering ${frames.length} candidates at ${canvasW}×${canvasH}`)

      for (const ms of frames) {
        await page.evaluate((m) => window.__shader.setFrame(m), ms)
        await page.evaluate(() => window.__shader.waitTwoFrames())
        const png = path.join(OUT_DIR, `candidate_${String(ms).padStart(5, '0')}.png`)
        await canvasHandle.screenshot({ path: png, omitBackground: false })
        log(`  ${path.basename(png)}`)
      }

      log('converting to webp quality 90...')
      for (const ms of frames) {
        const png = path.join(OUT_DIR, `candidate_${String(ms).padStart(5, '0')}.png`)
        const webp = png.replace(/\.png$/, '.webp')
        await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-quality', '90', webp])
      }

      // Copy candidates into public/ so you can view them in the browser
      const publicDir = 'public/shader-candidates'
      await rm(publicDir, { recursive: true, force: true })
      await mkdir(publicDir, { recursive: true })
      for (const ms of frames) {
        const webp = path.join(OUT_DIR, `candidate_${String(ms).padStart(5, '0')}.webp`)
        await run('cp', [webp, path.join(publicDir, `candidate_${String(ms).padStart(5, '0')}.webp`)])
      }

      // Log sizes
      const entries = await readdir(OUT_DIR)
      const webpFiles = entries.filter((e) => e.endsWith('.webp')).sort()
      log('')
      log('stage 1 complete — candidates:')
      const { stat } = await import('node:fs/promises')
      for (const f of webpFiles) {
        const s = await stat(path.join(OUT_DIR, f))
        log(`  ${f}  ${(s.size / 1024).toFixed(0)} KB`)
      }
      log('')
      log(`view at: http://localhost:${PORT}/shader-candidates-picker`)
      log('(or open the webp files directly in public/shader-candidates/)')
    } else {
      // ── Stage 2: final render at chosen frame, full canvas, slot crop ──
      log(`stage 2 — rendering winner frame ${FRAME}ms at ${canvasW}×${canvasH}`)
      await page.evaluate((m) => window.__shader.setFrame(m), FRAME)
      await page.evaluate(() => window.__shader.waitTwoFrames())

      const fullPng = path.join(OUT_DIR, 'full.png')
      await canvasHandle.screenshot({ path: fullPng, omitBackground: false })
      log(`full canvas: ${fullPng}`)

      // Crop into slot images with bleed. Slot i covers y = [i*SLOTH - BLEED, (i+1)*SLOTH + BLEED]
      // clipped to [0, canvasH].
      const numSlots = Math.ceil(canvasH / SLOTH)
      log(`slotting into ${numSlots} slots, ${SLOTH}px + ${BLEED}px bleed`)

      const outWebpDir = 'public/bg-slots'
      await rm(outWebpDir, { recursive: true, force: true })
      await mkdir(outWebpDir, { recursive: true })

      for (let i = 0; i < numSlots; i++) {
        const y0 = Math.max(0, i * SLOTH - BLEED)
        const y1 = Math.min(canvasH, (i + 1) * SLOTH + BLEED)
        const h = y1 - y0
        const slotPng = path.join(OUT_DIR, `slot-${i}.png`)
        const slotWebp = path.join(outWebpDir, `slot-${i}.webp`)
        await run('ffmpeg', [
          '-y', '-loglevel', 'error',
          '-i', fullPng,
          '-vf', `crop=${canvasW}:${h}:0:${y0}`,
          slotPng,
        ])
        await run('ffmpeg', [
          '-y', '-loglevel', 'error',
          '-i', slotPng,
          '-lossless', '1',
          '-compression_level', '6',
          slotWebp,
        ])
        const { stat } = await import('node:fs/promises')
        const s = await stat(slotWebp)
        log(`  slot ${i}: y=${y0}..${y1} (${h}px tall)  →  ${path.basename(slotWebp)}  ${(s.size / 1024).toFixed(0)} KB`)
      }

      log('')
      log(`stage 2 complete — slot webps in ${outWebpDir}/`)
    }
  } finally {
    if (browser) await browser.close().catch(() => {})
    vite.kill('SIGTERM')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
