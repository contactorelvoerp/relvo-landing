import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

export const relvoCoinSchema = z.object({
  background: z.string(),
  coinColor: z.string(),
});

type RelvoCoinGraphicProps = {
  coinColor: string;
  frame: number;
  durationInFrames: number;
  mode?: "stamp-erase" | "erase-stamp";
  holdFrames?: number;
};

export const RelvoMarkStatic: React.FC<{ coinColor: string }> = ({
  coinColor,
}) => {
  return (
    <svg width="1080" height="1080" viewBox="0 0 1080 1080">
      <g transform={`translate(${ANIMATION_MARK_OFFSET} ${ANIMATION_MARK_OFFSET}) scale(${ANIMATION_MARK_SCALE})`}>
        {BASE_PETALS.map((p, i) => (
          <ellipse
            key={i}
            cx={p.cx}
            cy={p.cy}
            rx={p.rx}
            ry={p.ry}
            fill={coinColor}
            transform={`rotate(${p.rot} ${p.cx} ${p.cy})`}
          />
        ))}
      </g>
    </svg>
  );
};

// Petals in travel order — natural clockwise sweep around the logo center.
// Geometry is normalized from `public/branding/1. Logotipo/SVG/Asset 18.svg`.
// The stamped ghosts render these exact shapes regardless of the flying coin's own spin.
const BASE_PETALS = [
  { cx: 539.08, cy: 197.61, rx: 197.73, ry: 197.61, rot: 0 }, // top
  { cx: 879.02, cy: 497.82, rx: 206.87, ry: 102.55, rot: -15.88 }, // right
  { cx: 758.67, cy: 899.16, rx: 138.83, ry: 204.13, rot: -39.29 }, // bottom-right
  { cx: 319.49, cy: 899.16, rx: 204.13, ry: 138.83, rot: -50.71 }, // bottom-left
  { cx: 195.98, cy: 510.82, rx: 167.04, ry: 198.87, rot: -71.58 }, // left
];
const PATH = [...BASE_PETALS, BASE_PETALS[0]];

const COIN_RX = 197.73;
const COIN_RY_MIN = 7; // never fully vanish — keep a visible sliver
const LOGO_CENTER = { x: 540, y: 540 };
const ANIMATION_MARK_SCALE = 0.65;
const ANIMATION_MARK_OFFSET = (1080 * (1 - ANIMATION_MARK_SCALE)) / 2;

// Convert a rotation (degrees) to the foreshortened ry for a coin spinning
// around its minor axis. At rot = 0°, 180°, ... the coin is face-on
// (ry = COIN_RX). At rot = 90°, 270°, ... it's edge-on (ry = COIN_RY_MIN).
const ryFromRot = (rotDeg: number) => {
  const c = Math.abs(Math.cos((rotDeg * Math.PI) / 180));
  return Math.max(COIN_RY_MIN, COIN_RX * c);
};

const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// How many extra full rotations the coin does on itself during a single
// pass, on top of the baseline needed to land each waypoint at its
// original orientation. The orbit around the logo center always sweeps
// exactly once per pass — this only speeds up the *self* spin.
const EXTRA_SPINS = 1;

// Unwrap the rotation sequence so the coin spins monotonically in one
// direction. Ellipses have 180° symmetry, so for each waypoint we pick
// whichever of {raw, raw+180, raw-180, raw+360, ...} is closest to the
// previous value while also being >= the previous value (forces CW spin).
// Then we add EXTRA_SPINS full turns distributed evenly across the path.
const UNWRAPPED_ROT: number[] = (() => {
  const base: number[] = [];
  PATH.forEach((p, i) => {
    if (i === 0) {
      base.push(p.rot);
      return;
    }
    const prev = base[i - 1];
    let best = p.rot;
    let bestDelta = Infinity;
    for (let k = -4; k <= 4; k++) {
      const candidate = p.rot + k * 180;
      const delta = candidate - prev;
      if (delta >= 0 && delta < bestDelta) {
        best = candidate;
        bestDelta = delta;
      }
    }
    base.push(best);
  });
  const segCount = PATH.length - 1;
  return base.map((v, i) => v + EXTRA_SPINS * 360 * (i / segCount));
})();

// Polar coords of each waypoint around the logo center, precomputed once.
// Each angle is unwrapped to be the closest equivalent to the previous one
// (shortest signed path, not forced clockwise). This means the coin takes
// the shortest arc between adjacent petals, even if that goes backwards.
const POLAR: { r: number; a: number }[] = (() => {
  const out: { r: number; a: number }[] = [];
  let prev = 0;
  PATH.forEach((p, i) => {
    const dx = p.cx - LOGO_CENTER.x;
    const dy = p.cy - LOGO_CENTER.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    let a = Math.atan2(dy, dx);
    if (i === 0) {
      prev = a;
    } else {
      // Pick the equivalent of `a` (modulo 2π) closest to `prev`.
      const delta = ((a - prev + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      a = prev + delta;
      prev = a;
    }
    out.push({ r, a });
  });
  return out;
})();

// Walk the path at progress p in [0,1]. Returns the flying coin state,
// interpolating in polar space for an arced trajectory.
const coinAt = (p: number) => {
  const segCount = PATH.length - 1;
  const sp = p * segCount;
  const idx = Math.min(segCount - 1, Math.floor(sp));
  const t = Math.min(1, sp - idx);

  const pFrom = POLAR[idx];
  const pTo = POLAR[idx + 1];

  const r = lerp(pFrom.r, pTo.r, t);
  const a = lerp(pFrom.a, pTo.a, t);
  const cx = LOGO_CENTER.x + r * Math.cos(a);
  const cy = LOGO_CENTER.y + r * Math.sin(a);

  const rot = lerp(UNWRAPPED_ROT[idx], UNWRAPPED_ROT[idx + 1], t);
  return {
    cx,
    cy,
    rx: COIN_RX,
    ry: ryFromRot(rot),
    rot,
  };
};

export const RelvoCoinGraphic: React.FC<RelvoCoinGraphicProps> = ({
  coinColor,
  frame,
  durationInFrames,
  mode = "stamp-erase",
  holdFrames = 16,
}) => {
  // Timeline (in frames):
  //   pass 1 (stamp)  |  hold  |  pass 2 (erase)  |  hold
  const passFrames = Math.floor((durationInFrames - 2 * holdFrames) / 2);

  let phase: "stamp" | "hold1" | "erase" | "hold2" = "hold2";
  let passProgress = 1;
  if (frame < passFrames) {
    phase = "stamp";
    passProgress = frame / passFrames;
  } else if (frame < passFrames + holdFrames) {
    phase = "hold1";
    passProgress = 1;
  } else if (frame < 2 * passFrames + holdFrames) {
    phase = "erase";
    passProgress = (frame - passFrames - holdFrames) / passFrames;
  } else {
    phase = "hold2";
    passProgress = 0;
  }

  const eased = easeInOutQuad(Math.min(1, Math.max(0, passProgress)));

  // The flying coin walks path index 0..N-1 during a pass.
  // During stamp: position = coinAt(eased).
  // During erase: same path, different meaning (erasing behind it).
  const coin = coinAt(eased);
  const segCount = PATH.length - 1;
  const walkedTo = eased * segCount;

  // Petal visibility:
  // - stamp phase: petal i visible once coin has reached waypoint i+1
  //   (i.e. walkedTo > i + ~1, meaning the segment ending at petal i is done)
  //   Waypoint 0 (top) appears immediately on arrival at idx 0+1=1... but the
  //   coin starts AT waypoint 0, so show petal 0 from the start.
  // - erase phase: petal i disappears once coin has passed through it again,
  //   i.e. walkedTo > i.
  const petalOpacities = BASE_PETALS.map((_, i) => {
    if (mode === "erase-stamp") {
      if (phase === "stamp") {
        // First orbit removes the petals from the resting logo.
        if (i === 0) return walkedTo >= segCount ? 0 : 1;
        return walkedTo >= i ? 0 : 1;
      }
      if (phase === "hold1") return 0;
      if (phase === "erase") {
        // Second orbit prints them back and leaves them in place.
        if (i === 0) return walkedTo >= segCount ? 1 : 0;
        return walkedTo >= i ? 1 : 0;
      }
      return 1;
    }

    if (phase === "stamp") {
      return walkedTo >= i ? 1 : 0;
    }
    if (phase === "hold1") return 1;
    if (phase === "erase") {
      if (i === 0) return walkedTo >= segCount ? 0 : 1;
      return walkedTo >= i ? 0 : 1;
    }
    return 0;
  });

  const showFlyingCoin = phase === "stamp" || phase === "erase" || phase === "hold1" || phase === "hold2";
  // Park the coin at the top during holds.
  const restCoin = BASE_PETALS[0];
  const displayCoin =
    phase === "hold1" || phase === "hold2"
      ? {
          cx: restCoin.cx,
          cy: restCoin.cy,
          rx: COIN_RX,
          ry: ryFromRot(restCoin.rot),
          rot: restCoin.rot,
        }
      : coin;

  return (
    <svg width="1080" height="1080" viewBox="0 0 1080 1080">
      <g transform={`translate(${ANIMATION_MARK_OFFSET} ${ANIMATION_MARK_OFFSET}) scale(${ANIMATION_MARK_SCALE})`}>
        {BASE_PETALS.map((p, i) => (
          <ellipse
            key={i}
            cx={p.cx}
            cy={p.cy}
            rx={p.rx}
            ry={p.ry}
            fill={coinColor}
            opacity={petalOpacities[i]}
            transform={`rotate(${p.rot} ${p.cx} ${p.cy})`}
          />
        ))}
        {showFlyingCoin && (
          <ellipse
            cx={displayCoin.cx}
            cy={displayCoin.cy}
            rx={displayCoin.rx}
            ry={displayCoin.ry}
            fill={coinColor}
            transform={`rotate(${displayCoin.rot} ${displayCoin.cx} ${displayCoin.cy})`}
          />
        )}
      </g>
    </svg>
  );
};

export const RelvoCoin: React.FC<z.infer<typeof relvoCoinSchema>> = ({
  background,
  coinColor,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{ backgroundColor: background, alignItems: "center", justifyContent: "center" }}
    >
      <RelvoCoinGraphic
        coinColor={coinColor}
        frame={frame}
        durationInFrames={durationInFrames}
      />
    </AbsoluteFill>
  );
};
