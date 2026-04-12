#!/usr/bin/env node
/**
 * find-loop-point.mjs
 *
 * Searches for the best near-match point to loop the RelvoGradient shader.
 *
 * The shader drives each blob with DRIFT(t, px, py, maxD) which is a sum of
 * sines at incommensurate frequencies (1.0, 1.618, 2.879, 5.213, 2.118) —
 * no exact period exists. But trajectories are bounded, so over a long
 * enough window we can find a point where position AND velocity are close
 * to t=0. That's the spot to cut the video for a clean crossfade.
 *
 * The shader's effective time scale is t = 0.1 * (u_time + 7), so "shader
 * seconds" (u_time) are what this script reports — that's what a video
 * recorder sees.
 *
 * We intentionally IGNORE ORBIT_WOBBLE and SHAPE_WOBBLE (simplex noise).
 * They're high-frequency and low-amplitude (~0.04-0.08 vs drift's 0.08-0.30),
 * so a 1-2s crossfade easily hides their discontinuity. The drift is the
 * low-frequency backbone that would visually "jump" if mismatched.
 *
 * Usage:
 *   node scripts/find-loop-point.mjs                  # search all 14 blobs
 *   node scripts/find-loop-point.mjs --blobs=0,1      # only hero blobs (A,B)
 *   node scripts/find-loop-point.mjs --from=20 --to=40 --step=0.01
 */

// ── Blob config (mirrors relvo-gradient.js) ─────────────────────────────────

const BLOBS = [
  { name: 'A (top-left, hero)',   px: 0.0,  py: 0.5,  maxD: 0.30 },
  { name: 'B (right, hero)',      px: 5.24, py: 5.74, maxD: 0.08 },
  { name: 'C',                    px: 4.2,  py: 4.7,  maxD: 0.08 },
  { name: 'D',                    px: 6.3,  py: 6.8,  maxD: 0.08 },
  { name: 'E',                    px: 8.4,  py: 8.9,  maxD: 0.08 },
  { name: 'F',                    px: 10.5, py: 11.0, maxD: 0.08 },
  { name: 'G',                    px: 12.6, py: 13.1, maxD: 0.08 },
  { name: 'H',                    px: 14.7, py: 15.2, maxD: 0.08 },
  { name: 'I',                    px: 16.8, py: 17.3, maxD: 0.08 },
  { name: 'J',                    px: 18.9, py: 19.4, maxD: 0.08 },
  { name: 'K',                    px: 21.0, py: 21.5, maxD: 0.08 },
  { name: 'L',                    px: 23.1, py: 23.6, maxD: 0.08 },
  { name: 'M',                    px: 25.2, py: 25.7, maxD: 0.08 },
  { name: 'N',                    px: 27.3, py: 27.8, maxD: 0.08 },
]

// ── Drift function (exact copy of shader DRIFT macro) ───────────────────────

function drift(t, px, py, maxD) {
  // sc = u_blobScale = 1.0 in practice, see ShaderBackground.jsx
  const sc = 1.0

  const x =
    ( 0.40 * Math.sin(1.000 * t + px)
    + 0.30 * Math.sin(1.618 * t + px + 1.2)
    + 0.20 * Math.sin(2.879 * t + px + 3.7)
    + 0.10 * Math.sin(5.213 * t + px + 0.4)
    )

  const y =
    ( 0.40 * Math.cos(1.000 * t + py + 0.7)
    + 0.30 * Math.cos(1.618 * t + py + 2.9)
    + 0.20 * Math.cos(2.879 * t + py + 5.1)
    + 0.10 * Math.cos(2.118 * t + py + 1.8)
    )

  return [maxD * sc * x, maxD * sc * y]
}

function driftVelocity(t, px, py, maxD) {
  const sc = 1.0

  // d/dt of x-drift
  const vx =
    ( 0.40 * 1.000 * Math.cos(1.000 * t + px)
    + 0.30 * 1.618 * Math.cos(1.618 * t + px + 1.2)
    + 0.20 * 2.879 * Math.cos(2.879 * t + px + 3.7)
    + 0.10 * 5.213 * Math.cos(5.213 * t + px + 0.4)
    )

  // d/dt of y-drift  (cos derivative is -sin)
  const vy =
    ( 0.40 * 1.000 * -Math.sin(1.000 * t + py + 0.7)
    + 0.30 * 1.618 * -Math.sin(1.618 * t + py + 2.9)
    + 0.20 * 2.879 * -Math.sin(2.879 * t + py + 5.1)
    + 0.10 * 2.118 * -Math.sin(2.118 * t + py + 1.8)
    )

  return [maxD * sc * vx, maxD * sc * vy]
}

// ── The shader's effective t ────────────────────────────────────────────────
//
// In the shader:   t = 0.1 * (u_time + 7.0)
// So at u_time=0 the shader is already at t = 0.7 (not zero).
// A video recording starts at u_time=0 — we need to match THAT state.

const FIRST_FRAME_OFFSET = 7.0
const TIME_SCALE = 0.1

const shaderT = (uTime) => TIME_SCALE * (uTime + FIRST_FRAME_OFFSET)

// ── Argument parsing ────────────────────────────────────────────────────────

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  })
)

const FROM = parseFloat(args.from ?? '20')   // u_time seconds
const TO   = parseFloat(args.to   ?? '40')
const STEP = parseFloat(args.step ?? '0.005')  // ~5ms granularity
const BLOB_MASK = args.blobs
  ? args.blobs.split(',').map((n) => parseInt(n, 10))
  : BLOBS.map((_, i) => i)

// Weights: position error matters more than velocity because
// a crossfade can hide velocity mismatch more easily.
const W_POS = 1.0
const W_VEL = 0.15

// ── Search ──────────────────────────────────────────────────────────────────

const activeBlobs = BLOB_MASK.map((i) => ({ i, ...BLOBS[i] }))

// Reference state at u_time = 0  (i.e. shader t = 0.7)
const refT = shaderT(0)
const refPos = activeBlobs.map(({ px, py, maxD }) => drift(refT, px, py, maxD))
const refVel = activeBlobs.map(({ px, py, maxD }) => driftVelocity(refT, px, py, maxD))

// Per-blob error contribution is scaled by 1/maxD so that blob A (maxD=0.30)
// and blob C (maxD=0.08) contribute errors in comparable "% of available
// motion" units. Otherwise blob A would dominate the sum 14× just because
// it moves more in absolute terms — but a 0.01 error on blob A is only 3.3%
// of its travel while the same error on blob C is 12.5% of its travel.
//
// This was the refinement we discussed: blob A dominates the budget, so we
// compute a weighted score and also print per-blob numbers so the user can
// see whether the hero blobs specifically are in good shape.

const results = []

for (let uTime = FROM; uTime <= TO; uTime += STEP) {
  const t = shaderT(uTime)

  let weightedPosErr2 = 0
  let weightedVelErr2 = 0
  let heroPosErr2 = 0
  let heroVelErr2 = 0

  const perBlobPos = []

  for (let k = 0; k < activeBlobs.length; k++) {
    const { i, px, py, maxD } = activeBlobs[k]
    const [x, y] = drift(t, px, py, maxD)
    const [vx, vy] = driftVelocity(t, px, py, maxD)
    const dx = x - refPos[k][0]
    const dy = y - refPos[k][1]
    const dvx = vx - refVel[k][0]
    const dvy = vy - refVel[k][1]
    const p2 = dx * dx + dy * dy
    const v2 = dvx * dvx + dvy * dvy

    // Normalize by maxD to put blobs on equal footing
    const norm = 1 / (maxD * maxD)
    weightedPosErr2 += p2 * norm
    weightedVelErr2 += v2 * norm

    if (i === 0 || i === 1) {
      heroPosErr2 += p2
      heroVelErr2 += v2
    }

    perBlobPos.push({ i, dx, dy, mag: Math.sqrt(p2) })
  }

  const score = W_POS * weightedPosErr2 + W_VEL * weightedVelErr2

  results.push({
    uTime,
    score,
    posErr: Math.sqrt(weightedPosErr2 / activeBlobs.length),  // RMS over blobs
    velErr: Math.sqrt(weightedVelErr2 / activeBlobs.length),
    heroPosErr: Math.sqrt(heroPosErr2),
    heroVelErr: Math.sqrt(heroVelErr2),
    perBlobPos,
  })
}

// Find true local minima (neighbors on both sides have higher score).
// Previous dedupe by time-distance was flawed — a broad flat basin would
// only report one point. We want the distinct low-score regions.
const localMinima = []
for (let i = 1; i < results.length - 1; i++) {
  if (results[i].score < results[i - 1].score && results[i].score < results[i + 1].score) {
    localMinima.push(results[i])
  }
}
localMinima.sort((a, b) => a.score - b.score)
const topCandidates = localMinima.slice(0, 10)

// Also report the overall best, in case it sits at a window edge
const globalBest = [...results].sort((a, b) => a.score - b.score)[0]
if (!topCandidates.includes(globalBest)) topCandidates.unshift(globalBest)

// ── Report ──────────────────────────────────────────────────────────────────

console.log('Find-loop-point — RelvoGradient shader')
console.log('')
console.log(`Search window: u_time = ${FROM.toFixed(2)}s → ${TO.toFixed(2)}s, step ${(STEP*1000).toFixed(1)}ms`)
console.log(`Active blobs:  ${activeBlobs.map(b => b.i).join(',')} (of 0..13)`)
console.log(`Reference:     u_time = 0 (shader t = ${refT.toFixed(3)})`)
console.log('')
console.log(`Found ${localMinima.length} local minima in window.`)
console.log('Top candidates (weighted by 1/maxD so blobs are comparable):')
console.log('')

const pad = (s, n) => String(s).padEnd(n)
console.log(pad('rank', 6) + pad('u_time', 12) + pad('score', 12) + pad('RMS posErr', 14) + pad('RMS velErr', 14) + pad('hero posErr', 14) + pad('hero velErr', 14))
console.log('─'.repeat(86))

topCandidates.forEach((r, idx) => {
  console.log(
    pad(idx + 1, 6) +
    pad(r.uTime.toFixed(3) + 's', 12) +
    pad(r.score.toExponential(2), 12) +
    pad(r.posErr.toFixed(5), 14) +
    pad(r.velErr.toFixed(5), 14) +
    pad(r.heroPosErr.toFixed(5), 14) +
    pad(r.heroVelErr.toFixed(5), 14)
  )
})

console.log('')
console.log('Best match — per-blob state at candidate vs reference:')
console.log('(pos error in width-units; speed is |velocity| in width-units/s)')
const best = topCandidates[0]
const bestT = shaderT(best.uTime)
for (const { i, dx, dy, mag } of best.perBlobPos) {
  const { name, maxD, px, py } = BLOBS[i]
  const pctOfTravel = (mag / maxD) * 100
  const [vx, vy] = driftVelocity(bestT, px, py, maxD)
  const [rvx, rvy] = driftVelocity(refT, px, py, maxD)
  const speedNow = Math.sqrt(vx * vx + vy * vy)
  const speedRef = Math.sqrt(rvx * rvx + rvy * rvy)
  // Max possible drift speed for this blob (rough bound): sum of (amp * freq) * maxD
  const maxSpeed = (0.40 * 1.000 + 0.30 * 1.618 + 0.20 * 2.879 + 0.10 * 5.213) * maxD
  const speedPct = (speedNow / maxSpeed) * 100
  console.log(
    `  blob ${i} ${pad(name, 24)}  |Δpos|=${mag.toFixed(5)} (${pctOfTravel.toFixed(1)}%)  speed=${speedNow.toFixed(4)} (${speedPct.toFixed(0)}% of max)  ref_speed=${speedRef.toFixed(4)}`
  )
}

console.log('')
console.log('Interpretation:')
console.log(`  • u_time ${best.uTime.toFixed(3)}s is the shader time to stop recording.`)
console.log(`  • Record from u_time = 0 to u_time = ${best.uTime.toFixed(3)}s (the recording itself is this long in wall-clock seconds).`)
console.log(`  • Crossfade the last 1-2s of the clip into the first 1-2s.`)
console.log(`  • Hero RMS pos error: ${best.heroPosErr.toFixed(5)} width-units — aim for < 0.02 for an invisible seam.`)
