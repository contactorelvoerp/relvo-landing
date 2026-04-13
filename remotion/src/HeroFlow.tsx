import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { RelvoCoinGraphic, RelvoMarkStatic } from "./RelvoCoin";

export const heroFlowSchema = z.object({
  color: z.string(),
  seed: z.number().int().default(1),
  background: z.string().default("transparent"),
});

// ---- Deterministic PRNG ----------------------------------------------------
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// ---- Canvas & geometry constants -------------------------------------------
const W = 1920;
const H = 320; // 6:1 aspect

const NECK_X_START = W * 0.46;
const NECK_X_END = W * 0.54;
const NECK_Y_BAND = 42;

const N_RAILS = 5;
const DOTS_PER_RAIL = 2;
const N_DOTS = N_RAILS * DOTS_PER_RAIL;

const DOT_RADIUS = 4.25;
const NODE_RADIUS = 2.25; // slightly smaller than moving dots
const LINE_WIDTH = 2.5; // thinner per user request
const OFFSCREEN_PAD = 70;
const LEFT_ENTRY_EXTENSION = 72;
const CIRCUIT_X_SHIFT = 60;
const EDGE_FADE_WIDTH = 120;
const NECK_CIRCLE_RADIUS = 32;
const COIN_ANIMATION_FRAMES = 56;

// Motion model:
// - Outside the funnel, every rail moves at the same base speed.
// - Rails therefore reach the funnel at different times.
// - Inside the funnel, each rail gets its own time budget so they all exit
//   the funnel together, creating the "organization" effect.
// - After the funnel, all rails return to the same base speed.
const BASE_SPEED = 3.5; // px / frame outside the funnel (unused — see resolveRailTiming)
const FUNNEL_SYNC_WINDOW = 20; // extra frames after the latest arrival
const EXIT_SPEED_MULT = 1.7; // post-funnel speed multiplier

// Vertical slot grid for left-side rail placement.
const N_SLOTS = 9;
const SLOT_MARGIN = 26;

// Horizontal slot grid so vertical segments align to a clean column lattice.
const WANDER_X_START = LEFT_ENTRY_EXTENSION + CIRCUIT_X_SHIFT;
const WANDER_X_END = W * 0.32 + CIRCUIT_X_SHIFT;
const N_X_SLOTS = 11;
const xSlotPos = (s: number) =>
  WANDER_X_START + (s * (WANDER_X_END - WANDER_X_START)) / (N_X_SLOTS - 1);
const slotY = (s: number) => SLOT_MARGIN + (s * (H - 2 * SLOT_MARGIN)) / (N_SLOTS - 1);

// Quarter-arc corner radius and chance of rounding.
const CORNER_R = 18;
const ROUND_CORNER_CHANCE = 0.5;

// Curve subdivision counts for arc-length sampling.
const ARC_SUBDIV = 10;
const BEZIER_SUBDIV = 24;

// ---- Types -----------------------------------------------------------------
type Pt = { x: number; y: number };

type RailPath = {
  pathD: string;
  sample: Pt[]; // dense polyline for arc-length sampling
  segLens: number[];
  cumLens: number[];
  total: number;
  corners: Pt[]; // sharp corners only (for junction nodes)
  // Phase boundaries in arc-length along `sample`.
  wanderLen: number;
  neckLen: number;
  exitLen: number;
  funnelEntryFrame: number;
  funnelExitFrame: number;
  leadInLen: number;
  tailOutLen: number;
  cycleLen: number;
  baseSpeed: number;
  exitSpeed: number;
};

// ---- Helpers ---------------------------------------------------------------
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const cubicBezier = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const u = 1 - t;
  const b0 = u * u * u;
  const b1 = 3 * u * u * t;
  const b2 = 3 * u * t * t;
  const b3 = t * t * t;
  return {
    x: b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
    y: b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y,
  };
};

// Build a left-side orthogonal wander as a sequence of H/V segment endpoints
// snapped to slot Ys. Returns the raw corner list before any rounding.
const buildWanderCorners = (
  seed: number,
  rail: number,
  neckSlot: number,
  usedPerColumn: Set<number>[]
): Pt[] => {
  const rand = mulberry32(seed * 1009 + rail * 9173 + 31);

  // Start in an available slot in column 0.
  const col0 = usedPerColumn[0];
  let startSlot = Math.floor(rand() * N_SLOTS);
  for (let guard = 0; guard < N_SLOTS && col0.has(startSlot); guard++) {
    startSlot = (startSlot + 1) % N_SLOTS;
  }
  col0.add(startSlot);

  // Pick ascending x-slot indices for each vertical jog. The wander uses
  // SEGMENTS H/V pairs, so we need SEGMENTS distinct x-columns (column 0 is
  // the starting edge at x=0 and doesn't count).
  const SEGMENTS = 7;
  const xCols: number[] = [];
  {
    const available: number[] = [];
    for (let k = 1; k < N_X_SLOTS; k++) available.push(k);
    // Fisher-Yates with the seeded rand.
    for (let k = available.length - 1; k > 0; k--) {
      const j = Math.floor(rand() * (k + 1));
      [available[k], available[j]] = [available[j], available[k]];
    }
    const picked = available.slice(0, SEGMENTS).sort((a, b) => a - b);
    xCols.push(...picked);
  }

  const startY = slotY(startSlot);
  const pts: Pt[] = [{ x: 0, y: startY }];

  let curSlot = startSlot;
  for (let s = 0; s < SEGMENTS; s++) {
    const x = xSlotPos(xCols[s]);
    // End of horizontal segment.
    pts.push({ x, y: slotY(curSlot) });

    // Pick a new slot for the vertical jog: last segment snaps to neckSlot;
    // otherwise pick a nearby unused slot.
    let newSlot: number;
    if (s === SEGMENTS - 1) {
      newSlot = neckSlot;
    } else {
      const col = usedPerColumn[s + 1];
      const maxJog = 4;
      let candidate = curSlot + Math.floor(rand() * (2 * maxJog + 1)) - maxJog;
      candidate = Math.max(0, Math.min(N_SLOTS - 1, candidate));
      for (let guard = 0; guard < N_SLOTS && col.has(candidate); guard++) {
        candidate = (candidate + 1) % N_SLOTS;
      }
      col.add(candidate);
      newSlot = candidate;
    }
    curSlot = newSlot;
    pts.push({ x, y: slotY(curSlot) });
  }
  return pts;
};

// Sample N points along a quarter arc from tIn to tOut around `center`.
const sampleArc = (tIn: Pt, tOut: Pt, center: Pt, n: number): Pt[] => {
  const a0 = Math.atan2(tIn.y - center.y, tIn.x - center.x);
  let a1 = Math.atan2(tOut.y - center.y, tOut.x - center.x);
  // Keep the short way (quarter turn).
  let d = a1 - a0;
  if (d > Math.PI) d -= 2 * Math.PI;
  if (d < -Math.PI) d += 2 * Math.PI;
  const r = Math.hypot(tIn.x - center.x, tIn.y - center.y);
  const out: Pt[] = [];
  for (let k = 1; k <= n; k++) {
    const t = k / n;
    const a = a0 + d * t;
    out.push({ x: center.x + Math.cos(a) * r, y: center.y + Math.sin(a) * r });
  }
  return out;
};

// ---- Rail builder ----------------------------------------------------------
const buildRails = (seed: number): RailPath[] => {
  // Assign each rail a neck slot (tightly packed around the center slot).
  const centerSlot = (N_SLOTS - 1) / 2;
  // Rails get neck slots in a tight cluster near the center.
  const neckSlots: number[] = [];
  for (let i = 0; i < N_RAILS; i++) {
    neckSlots.push(centerSlot + (i - (N_RAILS - 1) / 2) * 0.2);
  }

  // Shared per-column slot occupancy to reduce overlap between rails.
  const usedPerColumn: Set<number>[] = Array.from({ length: N_X_SLOTS + 2 }, () => new Set());

  // Global corner rounding registry. If two rails meet at the same (x, y)
  // vertex, the second rail must reuse the first rail's rounding decision —
  // otherwise a rounded path overlaps a sharp L-bend and both render.
  const cornerRegistry = new Map<string, boolean>();
  const cornerKey = (p: Pt) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`;

  const rails: RailPath[] = [];
  for (let i = 0; i < N_RAILS; i++) {
    const neckY = H / 2 - NECK_Y_BAND / 2 + (i * NECK_Y_BAND) / (N_RAILS - 1);
    const neckSlotVirtual = neckSlots[i];
    const wander = buildWanderCorners(
      seed,
      i,
      // map virtual slot back to y so the last wander corner aligns with the
      // S-curve entry at the correct neckY. We pass a slot index that exists
      // in the grid — use the closest integer slot and correct later.
      Math.round(neckSlotVirtual),
      usedPerColumn
    );

    // Pop the final wander segment — we'll replace it with an S-curve into
    // the neck so the entry is smooth (mirror of the exit S-curve).
    // The wander now ends at its penultimate point (some natural slot Y).
    wander.pop();
    wander.pop();
    // Decide ahead of time which interior corners round. A corner `k` is
    // interior if 0 < k < wander.length - 1. We require both incident segments
    // to be strictly orthogonal (one H, one V) and long enough for the arc.
    const rounded = new Set<number>();
    const cornerRand = mulberry32(seed * 2029 + i * 4441 + 17);
    for (let k = 1; k < wander.length - 1; k++) {
      const a = wander[k - 1];
      const b = wander[k];
      const c = wander[k + 1];
      const seg1H = Math.abs(a.y - b.y) < 0.5;
      const seg1V = Math.abs(a.x - b.x) < 0.5;
      const seg2H = Math.abs(b.y - c.y) < 0.5;
      const seg2V = Math.abs(b.x - c.x) < 0.5;
      const orthogonal = (seg1H && seg2V) || (seg1V && seg2H);
      if (!orthogonal) continue;
      const lenAB = Math.hypot(b.x - a.x, b.y - a.y);
      const lenBC = Math.hypot(c.x - b.x, c.y - b.y);
      if (lenAB < CORNER_R * 2.2 || lenBC < CORNER_R * 2.2) continue;
      const key = cornerKey(b);
      const priorDecision = cornerRegistry.get(key);
      if (priorDecision !== undefined) {
        // Reuse prior rail's decision to avoid doubled rendering.
        if (priorDecision) rounded.add(k);
      } else {
        const decision = cornerRand() < ROUND_CORNER_CHANCE;
        cornerRegistry.set(key, decision);
        if (decision) rounded.add(k);
      }
    }

    // Emit path commands and sample points. Iterate edges, not corners.
    const sample: Pt[] = [wander[0]];
    const dCmds: string[] = [`M ${wander[0].x.toFixed(1)} ${wander[0].y.toFixed(1)}`];
    const sharpCorners: Pt[] = [];

    for (let k = 0; k < wander.length - 1; k++) {
      const a = wander[k];
      const b = wander[k + 1];

      // If the endpoint b is a rounded corner, stop short at its tangent-in.
      if (rounded.has(k + 1)) {
        const dirX = Math.sign(b.x - a.x);
        const dirY = Math.sign(b.y - a.y);
        const tIn: Pt = { x: b.x - dirX * CORNER_R, y: b.y - dirY * CORNER_R };
        dCmds.push(`L ${tIn.x.toFixed(1)} ${tIn.y.toFixed(1)}`);
        sample.push(tIn);

        // Emit the arc from tIn to tOut around b.
        const next = wander[k + 2];
        const ndirX = Math.sign(next.x - b.x);
        const ndirY = Math.sign(next.y - b.y);
        const tOut: Pt = { x: b.x + ndirX * CORNER_R, y: b.y + ndirY * CORNER_R };
        // Sweep: cross product of incoming and outgoing directions.
        const cross = dirX * ndirY - dirY * ndirX;
        const sweep: 0 | 1 = cross > 0 ? 1 : 0;
        dCmds.push(
          `A ${CORNER_R} ${CORNER_R} 0 0 ${sweep} ${tOut.x.toFixed(1)} ${tOut.y.toFixed(1)}`
        );
        // Sample the arc. Center is at the diagonal corner of the square
        // formed by b, tIn, tOut — specifically b + (dir1 + dir2)*0 doesn't
        // work; the true center is b + (-dirX + ndirX)*? Actually for a
        // quarter arc between two orthogonal segments, the center is the
        // point equidistant `r` from both tIn and tOut, which is
        // b + (-dirX*0 + ndirX*r, ...). The clean formula:
        //   center = tIn + (perp of incoming, pointing toward next direction) * r
        // Easier: center = (tIn.x or tOut.x — whichever is not equal to b's
        // coordinate along that axis). Since segments are orthogonal and
        // axis-aligned, one of tIn/tOut shares b.x and the other shares b.y.
        // The center is (tOut.x, tIn.y) OR (tIn.x, tOut.y) — pick the one
        // that's at distance r from both.
        const candidateA: Pt = { x: tOut.x, y: tIn.y };
        const candidateB: Pt = { x: tIn.x, y: tOut.y };
        const distA =
          Math.abs(Math.hypot(candidateA.x - tIn.x, candidateA.y - tIn.y) - CORNER_R) +
          Math.abs(Math.hypot(candidateA.x - tOut.x, candidateA.y - tOut.y) - CORNER_R);
        const distB =
          Math.abs(Math.hypot(candidateB.x - tIn.x, candidateB.y - tIn.y) - CORNER_R) +
          Math.abs(Math.hypot(candidateB.x - tOut.x, candidateB.y - tOut.y) - CORNER_R);
        const center = distA < distB ? candidateA : candidateB;
        const arcPts = sampleArc(tIn, tOut, center, ARC_SUBDIV);
        sample.push(...arcPts);
        continue;
      }

      // Normal straight segment. But if the *start* a was a rounded corner,
      // the previous iteration already emitted the arc ending at tOut, so we
      // draw from tOut to b instead of a to b.
      if (rounded.has(k)) {
        const prev = wander[k - 1];
        const pdirX = Math.sign(a.x - prev.x);
        const pdirY = Math.sign(a.y - prev.y);
        const ndirX = Math.sign(b.x - a.x);
        const ndirY = Math.sign(b.y - a.y);
        // a is the corner; tOut is along the outgoing direction.
        const tOut: Pt = { x: a.x + ndirX * CORNER_R, y: a.y + ndirY * CORNER_R };
        void pdirX;
        void pdirY;
        dCmds.push(`L ${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
        sample.push(tOut);
        sample.push(b);
        continue;
      }

      // Plain straight segment, no rounding on either end.
      dCmds.push(`L ${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
      sample.push(b);
      // Only mark b as a sharp corner if BOTH its incident segments are
      // fully plain (neither side rounded) — otherwise b may sit inside or
      // adjacent to an arc region.
      const isInterior = k + 1 < wander.length - 1;
      const prevSharp = !rounded.has(k);
      const nextSharp = !rounded.has(k + 1) && !rounded.has(k + 2);
      if (isInterior && prevSharp && nextSharp) {
        sharpCorners.push(b);
      }
    }

    // --- S-curve into neck (mirror of the exit) ---
    const sInStart: Pt = wander[wander.length - 1];
    const sInEnd: Pt = { x: NECK_X_START, y: neckY };
    const sInCp1: Pt = { x: lerp(sInStart.x, sInEnd.x, 0.5), y: sInStart.y };
    const sInCp2: Pt = { x: lerp(sInStart.x, sInEnd.x, 0.5), y: sInEnd.y };
    dCmds.push(
      `C ${sInCp1.x.toFixed(1)} ${sInCp1.y.toFixed(1)} ${sInCp2.x.toFixed(1)} ${sInCp2.y.toFixed(1)} ${sInEnd.x.toFixed(1)} ${sInEnd.y.toFixed(1)}`
    );
    for (let s = 1; s <= BEZIER_SUBDIV; s++) {
      const t = s / BEZIER_SUBDIV;
      sample.push(cubicBezier(sInStart, sInCp1, sInCp2, sInEnd, t));
    }

    // Sample index marking the end of the wander+S-in phase.
    const wanderEndIdx = sample.length - 1;

    // --- Neck straight ---
    const neckEnd: Pt = { x: NECK_X_END, y: neckY };
    dCmds.push(`L ${neckEnd.x.toFixed(1)} ${neckEnd.y.toFixed(1)}`);
    const NECK_SAMPLES = 3;
    for (let s = 1; s <= NECK_SAMPLES; s++) {
      const t = s / NECK_SAMPLES;
      sample.push({ x: lerp(NECK_X_START, NECK_X_END, t), y: neckY });
    }

    const neckEndIdx = sample.length - 1;

    // --- S-curve out of neck to rail end y ---
    const endY = H / 2 - (H * 0.7) / 2 + (i * (H * 0.7)) / (N_RAILS - 1);
    const sOutStart = neckEnd;
    const sOutEnd: Pt = { x: W * 0.68, y: endY };
    // Horizontal tangents at both ends for smoothness.
    const cp1: Pt = { x: lerp(sOutStart.x, sOutEnd.x, 0.5), y: sOutStart.y };
    const cp2: Pt = { x: lerp(sOutStart.x, sOutEnd.x, 0.5), y: sOutEnd.y };
    dCmds.push(
      `C ${cp1.x.toFixed(1)} ${cp1.y.toFixed(1)} ${cp2.x.toFixed(1)} ${cp2.y.toFixed(1)} ${sOutEnd.x.toFixed(1)} ${sOutEnd.y.toFixed(1)}`
    );
    for (let s = 1; s <= BEZIER_SUBDIV; s++) {
      const t = s / BEZIER_SUBDIV;
      sample.push(cubicBezier(sOutStart, cp1, cp2, sOutEnd, t));
    }

    // --- Final horizontal out to right edge ---
    dCmds.push(`L ${W} ${endY.toFixed(1)}`);
    sample.push({ x: W, y: endY });

    // Precompute arc-length tables for the sample polyline.
    const segLens: number[] = [];
    const cumLens: number[] = [0];
    let total = 0;
    for (let j = 0; j < sample.length - 1; j++) {
      const len = Math.hypot(
        sample[j + 1].x - sample[j].x,
        sample[j + 1].y - sample[j].y
      );
      segLens.push(len);
      total += len;
      cumLens.push(total);
    }

    const wanderLen = cumLens[wanderEndIdx];
    const neckLen = cumLens[neckEndIdx] - wanderLen;
    const exitLen = total - cumLens[neckEndIdx];

    rails.push({
      pathD: dCmds.join(" "),
      sample,
      segLens,
      cumLens,
      total,
      corners: sharpCorners,
      wanderLen,
      neckLen,
      exitLen,
      funnelEntryFrame: 0,
      funnelExitFrame: 0,
      leadInLen: OFFSCREEN_PAD,
      tailOutLen: OFFSCREEN_PAD,
      cycleLen: 0,
      baseSpeed: BASE_SPEED,
      exitSpeed: BASE_SPEED * EXIT_SPEED_MULT,
    });
  }

  return rails;
};

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const wrapDelta = (value: number, period: number) => {
  const half = period / 2;
  return ((((value + half) % period) + period) % period) - half;
};
// Cubic Hermite interpolation for the funnel segment. Boundary derivatives
// are pinned to BASE_SPEED so the path flows continuously into and out of the
// funnel while allowing each rail to use a different average speed inside it.
const funnelDistanceAt = (
  length: number,
  duration: number,
  elapsed: number,
  boundarySpeed: number
): number => {
  if (duration <= 0) return length;
  const u = clamp01(elapsed / duration);
  // Keep endpoint slopes in the monotone-safe range for cubic Hermite.
  const tangent = Math.max(
    0.2,
    Math.min(2.4, (boundarySpeed * duration) / length)
  );
  const h00 = 2 * u * u * u - 3 * u * u + 1;
  const h10 = u * u * u - 2 * u * u + u;
  const h01 = -2 * u * u * u + 3 * u * u;
  const h11 = u * u * u - u * u;
  return length * (h00 * 0 + h10 * tangent + h01 * 1 + h11 * tangent);
};

const resolveRailTiming = (
  rails: RailPath[],
  loopFrames: number
): RailPath[] => {
  const maxWander = Math.max(...rails.map((rail) => rail.wanderLen));
  const maxExit = Math.max(...rails.map((rail) => rail.exitLen));
  const usableFrames = Math.max(1, loopFrames - FUNNEL_SYNC_WINDOW);
  // Budget frames assuming the post-funnel portion runs EXIT_SPEED_MULT×
  // faster than baseSpeed.
  const baseSpeed =
    (OFFSCREEN_PAD + maxWander + (maxExit + OFFSCREEN_PAD) / EXIT_SPEED_MULT) /
    usableFrames;
  const exitSpeed = baseSpeed * EXIT_SPEED_MULT;
  const funnelEntryFrame = maxWander / baseSpeed;
  const funnelExitFrame = funnelEntryFrame + FUNNEL_SYNC_WINDOW;

  return rails.map((rail) => {
    const entryFrame = rail.wanderLen / baseSpeed;
    const postFunnelFrames = Math.max(0, loopFrames - (funnelExitFrame + rail.exitLen / exitSpeed));
    const tailOutLen = postFunnelFrames * exitSpeed;
    return {
      ...rail,
      funnelEntryFrame: entryFrame,
      funnelExitFrame,
      tailOutLen,
      cycleLen: rail.leadInLen + rail.total + tailOutLen,
      baseSpeed,
      exitSpeed,
    };
  });
};

// Given a loop-relative time in frames, compute the arc-length along a rail's
// sample polyline. All rails run at BASE_SPEED outside the funnel, but inside
// the funnel their speeds diverge so every rail leaves together.
const arcLenAt = (rail: RailPath, tFrames: number): number => {
  const t = Math.max(0, tFrames);
  const leadInFrames = rail.leadInLen / rail.baseSpeed;
  if (t <= leadInFrames) {
    return -rail.leadInLen + t * rail.baseSpeed;
  }

  const localT = t - leadInFrames;

  if (localT <= rail.funnelEntryFrame) {
    return Math.min(localT * rail.baseSpeed, rail.wanderLen);
  }
  if (localT <= rail.funnelExitFrame) {
    return (
      rail.wanderLen +
      funnelDistanceAt(
        rail.neckLen,
        rail.funnelExitFrame - rail.funnelEntryFrame,
        localT - rail.funnelEntryFrame,
        rail.baseSpeed
      )
    );
  }
  return Math.min(
    rail.wanderLen +
      rail.neckLen +
      (localT - rail.funnelExitFrame) * rail.exitSpeed,
    rail.total + rail.tailOutLen
  );
};

// Sample a point at arc-length `s` along a rail's dense polyline.
const sampleAt = (rail: RailPath, s: number): Pt => {
  if (s <= 0) {
    const start = rail.sample[0];
    return { x: start.x + s, y: start.y };
  }
  const total = rail.total;
  if (s >= total) {
    const end = rail.sample[rail.sample.length - 1];
    return { x: end.x + (s - total), y: end.y };
  }
  const t = s;
  for (let k = 0; k < rail.segLens.length; k++) {
    const start = rail.cumLens[k];
    const len = rail.segLens[k];
    if (t <= start + len) {
      const u = len === 0 ? 0 : (t - start) / len;
      const a = rail.sample[k];
      const b = rail.sample[k + 1];
      return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
    }
  }
  const last = rail.sample[rail.sample.length - 1];
  return { x: last.x, y: last.y };
};

// ---- Component -------------------------------------------------------------
export const HeroFlow: React.FC<z.infer<typeof heroFlowSchema>> = ({
  color,
  seed,
  background,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const rails = resolveRailTiming(buildRails(seed), durationInFrames);
  const loopFrames = durationInFrames;
  const syncFrame =
    rails.length === 0
      ? 0
      : rails[0].leadInLen / rails[0].baseSpeed + rails[0].funnelExitFrame;
  const loopFrame = (((frame + syncFrame) % loopFrames) + loopFrames) % loopFrames;
  const earliestEntryFrame =
    rails.length === 0
      ? 0
      : Math.min(...rails.map((rail) => rail.leadInLen / rail.baseSpeed + rail.funnelEntryFrame));
  const latestExitFrame =
    rails.length === 0
      ? 0
      : Math.max(...rails.map((rail) => rail.leadInLen / rail.baseSpeed + rail.funnelExitFrame));
  const neckCenterFrame = (earliestEntryFrame + latestExitFrame) / 2;
  const coinWavePeriod = loopFrames / DOTS_PER_RAIL;
  const coinDelta = wrapDelta(loopFrame - neckCenterFrame, coinWavePeriod);
  const showCoin = Math.abs(coinDelta) <= COIN_ANIMATION_FRAMES / 2;
  const visibleCoinFrame = showCoin
    ? coinDelta + COIN_ANIMATION_FRAMES / 2
    : 0;

  return (
    <AbsoluteFill>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {background !== "transparent" ? (
          <rect x="0" y="0" width={W} height={H} fill={background} />
        ) : null}
        <defs>
          <linearGradient id="hero-flow-edge-fade" x1="0" y1="0" x2={W} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop
              offset={`${(EDGE_FADE_WIDTH / W) * 100}%`}
              stopColor="white"
              stopOpacity="1"
            />
            <stop
              offset={`${100 - (EDGE_FADE_WIDTH / W) * 100}%`}
              stopColor="white"
              stopOpacity="1"
            />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="hero-flow-mask" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width={W} height={H} fill="url(#hero-flow-edge-fade)" />
          </mask>
          <clipPath id="hero-flow-neck-clip">
            <circle cx={W / 2} cy={H / 2} r={NECK_CIRCLE_RADIUS - LINE_WIDTH} />
          </clipPath>
        </defs>

        <g mask="url(#hero-flow-mask)">
          {rails.map((r, i) => (
            <path
              key={`r${i}`}
              d={r.pathD}
              fill="none"
              stroke={color}
              strokeWidth={LINE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {rails.flatMap((r, i) => {
            const rand = mulberry32(seed * 911 + i * 173 + 5);
            return r.corners
              .filter(() => rand() < 0.4) // keep ~40% of nodes, seeded
              .map((c, k) => (
                <circle
                  key={`c${i}-${k}`}
                  cx={c.x}
                  cy={c.y}
                  r={NODE_RADIUS}
                  fill="none"
                  stroke={color}
                  strokeWidth={LINE_WIDTH}
                />
              ));
          })}

          {Array.from({ length: N_DOTS }).map((_, i) => {
            const railIdx = i % N_RAILS;
            const rail = rails[railIdx];
            const phaseFrames =
              (Math.floor(i / N_RAILS) / DOTS_PER_RAIL) * loopFrames;
            const dotFrame =
              (((loopFrame + phaseFrames) % loopFrames) + loopFrames) % loopFrames;
            const s = arcLenAt(rail, dotFrame);
            const p = sampleAt(rail, s);
            return (
              <circle
                key={`d${i}`}
                cx={p.x}
                cy={p.y}
                r={DOT_RADIUS}
                fill={color}
              />
            );
          })}
        </g>

        <circle
          cx={W / 2}
          cy={H / 2}
          r={NECK_CIRCLE_RADIUS}
          fill="white"
          stroke={color}
          strokeWidth={LINE_WIDTH}
        />

        <g clipPath="url(#hero-flow-neck-clip)">
          {!showCoin ? (
            <g
              transform={`translate(${W / 2 - NECK_CIRCLE_RADIUS + 6}, ${H / 2 - NECK_CIRCLE_RADIUS + 6}) scale(${(NECK_CIRCLE_RADIUS * 2 - 12) / 1080})`}
            >
              <RelvoMarkStatic coinColor={color} />
            </g>
          ) : null}

          {showCoin ? (
            <g
              transform={`translate(${W / 2 - NECK_CIRCLE_RADIUS + 6}, ${H / 2 - NECK_CIRCLE_RADIUS + 6}) scale(${(NECK_CIRCLE_RADIUS * 2 - 12) / 1080})`}
            >
              <RelvoCoinGraphic
                coinColor={color}
                frame={visibleCoinFrame}
                durationInFrames={COIN_ANIMATION_FRAMES}
                mode="erase-stamp"
                holdFrames={0}
              />
            </g>
          ) : null}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
