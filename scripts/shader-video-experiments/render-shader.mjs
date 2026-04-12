#!/usr/bin/env node
/**
 * render-shader.mjs
 *
 * Renders the RelvoGradient shader frame-by-frame using headless Chrome
 * + Puppeteer, then encodes to webm via ffmpeg.
 *
 * Output:
 *   /tmp/relvo-shader/frame_XXXXX.png    (intermediate)
 *   /tmp/relvo-shader/shader-raw.webm    (final, looped via xfade)
 *
 * Usage:
 *   node scripts/render-shader.mjs
 *
 * Flags (all optional):
 *   --width=1920         viewport width
 *   --height=1080        viewport height
 *   --duration=21.5      seconds to render (the find-loop target)
 *   --fps=30             output framerate
 *   --xfade=1.5          crossfade length in seconds for the seamless loop
 *   --port=5179          vite dev server port
 *
 * Requires:
 *   - Vite dev server will be started internally on --port
 *   - ffmpeg on PATH
 *   - puppeteer installed (devDep)
 */

import { spawn } from 'node:child_process'
import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  })
)

const WIDTH = parseInt(args.width ?? '2560', 10)
const HEIGHT = parseInt(args.height ?? '1440', 10)
const DURATION = parseFloat(args.duration ?? '21.5')
const FPS = parseInt(args.fps ?? '30', 10)
const XFADE = parseFloat(args.xfade ?? '1.5')
const PORT = parseInt(args.port ?? '5179', 10)

const FRAMES = Math.round(DURATION * FPS)
const FRAME_MS = 1000 / FPS

const OUT_DIR = '/tmp/relvo-shader'
const RAW_WEBM = path.join(OUT_DIR, 'shader-noloop.webm')
const LOOP_WEBM = path.join(OUT_DIR, 'shader-loop.webm')

// ── helpers ────────────────────────────────────────────────────────────────

function log(msg) {
  process.stdout.write(`[render] ${msg}\n`)
}

function run(cmd, cmdArgs, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, cmdArgs, { stdio: 'inherit', ...opts })
    p.on('error', reject)
    p.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))
    )
  })
}

function startVite() {
  log(`starting vite dev server on port ${PORT}...`)
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
    proc.on('exit', (code) => {
      if (!ready) reject(new Error(`vite exited before ready (code ${code})`))
    })

    setTimeout(() => {
      if (!ready) reject(new Error('vite did not become ready in 30s'))
    }, 30_000)
  })
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  log(`config: ${WIDTH}×${HEIGHT}  duration=${DURATION}s  fps=${FPS}  xfade=${XFADE}s  frames=${FRAMES}`)

  await rm(OUT_DIR, { recursive: true, force: true })
  await mkdir(OUT_DIR, { recursive: true })

  const vite = await startVite()

  let browser
  try {
    log('launching headless chromium...')
    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--window-size=${WIDTH},${HEIGHT}`,
        '--enable-webgl',
        '--ignore-gpu-blocklist',
        '--disable-background-timer-throttling',
      ],
      defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
    })

    const page = await browser.newPage()
    page.on('console', (m) => log(`  page: ${m.text()}`))
    page.on('pageerror', (e) => log(`  page error: ${e.message}`))

    const url = `http://localhost:${PORT}/render-shader?w=${WIDTH}&h=${HEIGHT}`
    log(`opening ${url}`)
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30_000 })

    log('waiting for shader ready flag...')
    await page.waitForFunction(() => window.__shaderReady === true, { timeout: 15_000 })

    const canvasHandle = await page.waitForSelector('#render-root canvas', { timeout: 15_000 })
    const box = await canvasHandle.boundingBox()
    log(`canvas bbox: ${JSON.stringify(box)}`)
    if (!box || Math.abs(box.width - WIDTH) > 2 || Math.abs(box.height - HEIGHT) > 2) {
      throw new Error(
        `canvas bbox ${box?.width}x${box?.height} does not match target ${WIDTH}x${HEIGHT} — ` +
        `ShaderMount sizing is wrong, aborting before wasting a full render`
      )
    }
    // Also read back the underlying canvas's internal drawingbuffer size.
    // If the CSS box is right but the drawingBuffer is off, the PNG will
    // be the drawingBuffer size, not the CSS size.
    const drawingBufferSize = await page.evaluate(() => {
      const c = document.querySelector('#render-root canvas')
      return c ? { width: c.width, height: c.height } : null
    })
    log(`canvas drawingBuffer: ${JSON.stringify(drawingBufferSize)}`)

    log(`capturing ${FRAMES} frames (${(FRAMES / FPS).toFixed(2)}s @ ${FPS}fps)...`)

    const started = Date.now()
    for (let i = 0; i < FRAMES; i++) {
      const ms = i * FRAME_MS
      await page.evaluate((m) => window.__shader.setFrame(m), ms)
      await page.evaluate(() => window.__shader.waitTwoFrames())
      const out = path.join(OUT_DIR, `frame_${String(i).padStart(5, '0')}.png`)
      await canvasHandle.screenshot({ path: out, omitBackground: false })
      if (i % 30 === 0 || i === FRAMES - 1) {
        const elapsed = (Date.now() - started) / 1000
        const rate = (i + 1) / elapsed
        const eta = (FRAMES - i - 1) / rate
        log(`  frame ${i + 1}/${FRAMES}  (${rate.toFixed(1)} fps, ETA ${eta.toFixed(0)}s)`)
      }
    }

    log('capture done')
    await browser.close()
    browser = null

    log('encoding raw webm (vp9)...')
    await run('ffmpeg', [
      '-y',
      '-framerate', String(FPS),
      '-i', path.join(OUT_DIR, 'frame_%05d.png'),
      '-c:v', 'libvpx-vp9',
      '-b:v', '0',
      '-crf', '30',
      '-pix_fmt', 'yuv420p',
      '-row-mt', '1',
      RAW_WEBM,
    ])

    log('applying seamless crossfade loop...')
    // xfade offset = DURATION - XFADE, so the fade starts XFADE seconds
    // before the clip ends. Final clip length = DURATION - XFADE (the
    // overlap region is "consumed" by the fade).
    const offset = (DURATION - XFADE).toFixed(3)
    const finalDur = (DURATION - XFADE).toFixed(3)
    await run('ffmpeg', [
      '-y',
      '-i', RAW_WEBM,
      '-i', RAW_WEBM,
      '-filter_complex',
      `[0:v]trim=0:${DURATION},setpts=PTS-STARTPTS[v0];` +
      `[1:v]trim=0:${DURATION},setpts=PTS-STARTPTS[v1];` +
      `[v0][v1]xfade=transition=fade:duration=${XFADE}:offset=${offset}[out]`,
      '-map', '[out]',
      '-t', finalDur,
      '-c:v', 'libvpx-vp9',
      '-b:v', '0',
      '-crf', '30',
      '-pix_fmt', 'yuv420p',
      '-row-mt', '1',
      LOOP_WEBM,
    ])

    log(`done — outputs in ${OUT_DIR}`)
    log(`  raw (no loop):    ${RAW_WEBM}`)
    log(`  looped + xfade:   ${LOOP_WEBM}`)
  } finally {
    if (browser) await browser.close().catch(() => {})
    vite.kill('SIGTERM')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
