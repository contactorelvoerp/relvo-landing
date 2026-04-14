#!/usr/bin/env node
/**
 * Extract a frame from a transparent webm as a PNG with alpha preserved.
 *
 * Two modes:
 *
 *   Contact sheet (pick a frame):
 *     node scripts/extract-frame.mjs sheet <input.webm> [rows=4] [cols=4]
 *     → writes <input>.sheet.png with a labeled grid of candidate frames.
 *
 *   Single frame:
 *     node scripts/extract-frame.mjs extract <input.webm> <time-in-seconds> <output.png>
 *     → writes a single transparent PNG at the given timestamp.
 *
 * Requires ffmpeg with VP9 alpha decode support on PATH or at
 * /usr/local/bin/ffmpeg.
 */

import { execSync, execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const FFMPEG = existsSync('/usr/local/bin/ffmpeg') ? '/usr/local/bin/ffmpeg' : 'ffmpeg'
const FFPROBE = existsSync('/usr/local/bin/ffprobe') ? '/usr/local/bin/ffprobe' : 'ffprobe'

const getDuration = (file) => {
  const out = execFileSync(FFPROBE, [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    file,
  ]).toString().trim()
  return parseFloat(out)
}

const extractFrame = (input, time, output) => {
  execFileSync(FFMPEG, [
    '-y',
    '-ss', String(time),
    '-i', input,
    '-frames:v', '1',
    '-update', '1',
    '-vf', 'format=rgba',
    output,
  ], { stdio: ['ignore', 'ignore', 'ignore'] })
}

const buildContactSheet = (input, rows, cols) => {
  const duration = getDuration(input)
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Could not read duration from ${input}`)
  }
  const count = rows * cols
  // Sample frames at evenly spaced positions, skipping the very first
  // and last moments (which tend to be blank / fade-in / fade-out).
  const timestamps = Array.from({ length: count }, (_, i) => {
    const t = ((i + 0.5) / count) * duration
    return +t.toFixed(3)
  })

  const tmp = mkdtempSync(path.join(tmpdir(), 'frame-sheet-'))
  try {
    // Extract all candidate frames to the temp dir.
    timestamps.forEach((t, i) => {
      const frame = path.join(tmp, `${i}.png`)
      extractFrame(input, t, frame)
    })

    // Build a contact sheet with ffmpeg's xstack + drawtext for labels.
    // We use -f lavfi color inputs as a backdrop and overlay PNGs with
    // drawtext for each timestamp.
    //
    // Simpler approach: use `tile` filter + separate label overlay.
    // The frames are 1080×1080; scale each to something manageable.
    const thumbW = 240
    const thumbH = 240
    const gap = 4
    const labelH = 20

    // Build a lavfi input that creates a transparent canvas large enough
    // for the grid and composites each frame + label.
    const sheetW = cols * thumbW + (cols + 1) * gap
    const sheetH = rows * (thumbH + labelH) + (rows + 1) * gap

    const inputs = []
    timestamps.forEach((_, i) => {
      inputs.push('-i', path.join(tmp, `${i}.png`))
    })

    // Use a checkerboard pattern as a backdrop so alpha is visible in the
    // exported PNG contact sheet.
    const bg = `color=0xffffffff:size=${sheetW}x${sheetH}:rate=1`
    const filterParts = [`[0:v]null[bg]`]
    let lastLabel = 'bg'
    timestamps.forEach((t, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = gap + col * (thumbW + gap)
      const y = gap + row * (thumbH + labelH + gap)
      const labelY = y + thumbH + 2
      const streamIdx = i + 1 // 0 = bg, 1..N = frames
      filterParts.push(
        `[${streamIdx}:v]scale=${thumbW}:${thumbH}:force_original_aspect_ratio=decrease,pad=${thumbW}:${thumbH}:(ow-iw)/2:(oh-ih)/2:color=0xeeeeeeff[f${i}]`,
      )
      const nextLabel = `s${i}`
      filterParts.push(
        `[${lastLabel}][f${i}]overlay=${x}:${y}[t${i}]`,
      )
      filterParts.push(
        `[t${i}]drawtext=text='${t.toFixed(2)}s':x=${x}:y=${labelY}:fontsize=14:fontcolor=0x222222:font=monospace[${nextLabel}]`,
      )
      lastLabel = nextLabel
    })

    const filterGraph = filterParts.join(';')
    const outPath = input.replace(/\.webm$/i, '.sheet.png')

    const args = [
      '-y',
      '-f', 'lavfi',
      '-i', bg,
      ...inputs,
      '-filter_complex', filterGraph,
      '-map', `[${lastLabel}]`,
      '-frames:v', '1',
      '-update', '1',
      outPath,
    ]
    execFileSync(FFMPEG, args, { stdio: ['ignore', 'ignore', 'pipe'] })

    const size = statSync(outPath).size
    console.log(`✓ ${outPath}  (${(size / 1024).toFixed(1)} KB)`)
    console.log(`  Grid: ${rows}×${cols} = ${count} frames`)
    console.log(`  Timestamps: ${timestamps.map((t) => t.toFixed(2) + 's').join(', ')}`)
    console.log('')
    console.log('Pick a timestamp and run:')
    console.log(`  node scripts/extract-frame.mjs extract ${input} <time> <output.png>`)
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

const main = () => {
  const [, , mode, ...args] = process.argv

  if (mode === 'sheet') {
    const [input, rows = '4', cols = '4'] = args
    if (!input) {
      console.error('Usage: node scripts/extract-frame.mjs sheet <input.webm> [rows] [cols]')
      process.exit(1)
    }
    if (!existsSync(input)) {
      console.error(`Input not found: ${input}`)
      process.exit(1)
    }
    buildContactSheet(input, parseInt(rows, 10), parseInt(cols, 10))
  } else if (mode === 'extract') {
    const [input, timeStr, output] = args
    if (!input || !timeStr || !output) {
      console.error('Usage: node scripts/extract-frame.mjs extract <input.webm> <time-in-seconds> <output.png>')
      process.exit(1)
    }
    if (!existsSync(input)) {
      console.error(`Input not found: ${input}`)
      process.exit(1)
    }
    const time = parseFloat(timeStr)
    if (!Number.isFinite(time) || time < 0) {
      console.error(`Invalid time: ${timeStr}`)
      process.exit(1)
    }
    extractFrame(input, time, output)
    const size = statSync(output).size
    console.log(`✓ ${output}  (${(size / 1024).toFixed(1)} KB)  @ ${time}s`)
  } else {
    console.error('Usage:')
    console.error('  node scripts/extract-frame.mjs sheet <input.webm> [rows] [cols]')
    console.error('  node scripts/extract-frame.mjs extract <input.webm> <time-in-seconds> <output.png>')
    process.exit(1)
  }
}

main()
