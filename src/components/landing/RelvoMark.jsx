// Petals in travel order — natural clockwise sweep around the logo center.
// Each petal's `ry` and `rot` are from the original logo; the stamped ghosts
// always render these exact shapes regardless of the flying coin's own spin.
const BASE_PETALS = [
  { cx: 540.0, cy: 310.06, ry: 114.46, rot: 0 }, // top (face-on)
  { cx: 732.9, cy: 483.31, ry: 44.15, rot: 164.12 }, // right (edge-on)
  { cx: 657.69, cy: 698.74, ry: 62.33, rot: 51.88 }, // bottom-right
  { cx: 412.88, cy: 716.4, ry: 80.42, rot: 129.29 }, // bottom-left
  { cx: 341.5, cy: 491.47, ry: 96.75, rot: -161.58 }, // left
];
const PATH = [...BASE_PETALS, BASE_PETALS[0]];

const COIN_RX = 115;
const COIN_RY_MIN = 4; // never fully vanish — keep a visible sliver
const LOGO_CENTER = { x: 537, y: 540 };

const ryFromRot = (rotDeg) => {
  const c = Math.abs(Math.cos((rotDeg * Math.PI) / 180));
  return Math.max(COIN_RY_MIN, COIN_RX * c);
};

const easeInOutQuad = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const lerp = (a, b, t) => a + (b - a) * t;

const EXTRA_SPINS = 1;

const UNWRAPPED_ROT = (() => {
  const base = [];
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

const POLAR = (() => {
  const out = [];
  let prev = 0;
  PATH.forEach((p, i) => {
    const dx = p.cx - LOGO_CENTER.x;
    const dy = p.cy - LOGO_CENTER.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    let a = Math.atan2(dy, dx);
    if (i === 0) {
      prev = a;
    } else {
      const delta = ((a - prev + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      a = prev + delta;
      prev = a;
    }
    out.push({ r, a });
  });
  return out;
})();

const coinAt = (p) => {
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
    ry: ryFromRot(rot),
    rot,
  };
};

export const RelvoMarkStatic = ({ coinColor }) => {
  return (
    <svg width="1080" height="1080" viewBox="0 0 1080 1080">
      {BASE_PETALS.map((p, i) => (
        <ellipse
          key={i}
          cx={p.cx}
          cy={p.cy}
          rx={COIN_RX}
          ry={p.ry}
          fill={coinColor}
          transform={`rotate(${p.rot} ${p.cx} ${p.cy})`}
        />
      ))}
    </svg>
  );
};

export const RelvoCoinGraphic = ({
  coinColor,
  frame,
  durationInFrames,
  mode = "stamp-erase",
  holdFrames = 16,
}) => {
  const passFrames = Math.floor((durationInFrames - 2 * holdFrames) / 2);

  let phase = "hold2";
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

  const coin = coinAt(eased);
  const segCount = PATH.length - 1;
  const walkedTo = eased * segCount;

  const petalOpacities = BASE_PETALS.map((_, i) => {
    if (mode === "erase-stamp") {
      if (phase === "stamp") {
        if (i === 0) return walkedTo >= segCount ? 0 : 1;
        return walkedTo >= i ? 0 : 1;
      }
      if (phase === "hold1") return 0;
      if (phase === "erase") {
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
  const restCoin = BASE_PETALS[0];
  const displayCoin =
    phase === "hold1" || phase === "hold2"
      ? {
          cx: restCoin.cx,
          cy: restCoin.cy,
          ry: ryFromRot(restCoin.rot),
          rot: restCoin.rot,
        }
      : coin;

  return (
    <svg width="1080" height="1080" viewBox="0 0 1080 1080">
      {BASE_PETALS.map((p, i) => (
        <ellipse
          key={i}
          cx={p.cx}
          cy={p.cy}
          rx={COIN_RX}
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
          rx={COIN_RX}
          ry={displayCoin.ry}
          fill={coinColor}
          transform={`rotate(${displayCoin.rot} ${displayCoin.cx} ${displayCoin.cy})`}
        />
      )}
    </svg>
  );
};
