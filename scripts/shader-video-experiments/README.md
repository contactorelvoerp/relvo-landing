# Shader video experiments

Dead-end exploration kept for future reference. Do not run as part of normal
development — these only make sense if you're revisiting the idea of
replacing the live `RelvoGradient` shader with a pre-rendered looping video.

## Why this exists

The desktop `RelvoGradient` is GPU-heavy (14 blobs × full-viewport fragment
shader at DPR 2). We tried pre-rendering the shader to a seamlessly-looping
video so every user would hardware-decode a video instead of running live
WebGL. Mobile already uses a static CSS gradient (`BackgroundMobile`).

## Why it didn't ship

Gradient content + block-based video codecs = banding, lost grain, and
visible crossfade ghosting. Even at CRF 20 with grain injection, the
output looked noticeably cheaper than the live shader. The live shader's
organic unpredictable feel is actually load-bearing for the brand, and
no video approximation preserved it.

The correct next optimization (if we revisit) is probably **splitting
the shader into two passes**: low-frequency blob pass at half resolution
(4× cheaper, imperceptible because blobs are blurry anyway) + full-res
grain overlay on top. See the memory note at
`~/.claude/projects/-home-malakh-code-relvo-landing/memory/project_shader_perf_exploration.md`
for the full context.

## Files

### `find-loop-point.mjs`
Pure-JS search for the best near-match point in the shader's blob drift
trajectories. The shader's blob positions use `DRIFT(t)` = sum of sines at
frequencies (1.0, 1.618, 2.879, 5.213, 2.118) which are **incommensurate** —
there is no exact loop point mathematically. This script searches a time
window for points where blob position and velocity are close to t=0, giving
a target duration to record for a near-seamless crossfade loop.

Key finding: over a 5s-120s window there are only 4 true local minima.
The best match near 21.5s still has hero pos error 0.118 (39% of blob A's
travel), which is too much for a 1-2s crossfade to fully hide. Longer windows
find better matches but require larger video files.

Usage:
```
node scripts/shader-video-experiments/find-loop-point.mjs --from=5 --to=60 --step=0.005
node scripts/shader-video-experiments/find-loop-point.mjs --blobs=0,1  # hero blobs only
```

### `render-shader.mjs`
Puppeteer-based frame-perfect shader renderer. Spawns a Vite dev server on
port 5179, opens a non-headless Chromium, navigates to `/render-shader` (this
route has been removed from `App.jsx` — restore if you re-run), drives the
shader's `frame` prop deterministically via `window.__shader.setFrame(ms)`,
captures N PNGs, and pipes them to ffmpeg → VP9 webm.

Non-headless because headless Chromium falls back to SwiftShader for WebGL,
which doesn't run the shader correctly at capture resolution. A real visible
Chromium window uses the machine's GPU and produces pixel-perfect output.

If you revive this: you'll need to recreate `src/pages/RenderShader.jsx`
(use `<ShaderMount>` with `speed={0}` and expose `window.__shader.setFrame`),
and re-add `puppeteer` to devDependencies.

Usage:
```
node scripts/shader-video-experiments/render-shader.mjs --width=2560 --height=1440 --duration=21.5 --fps=30
```

Output goes to `/tmp/relvo-shader/`.

## Crossfade lessons learned

- `ffmpeg xfade` with naive offset+duration was producing no actual blend
  because the overall output duration + `-t` clip was slicing the unfaded
  head of the clip. The correct ffmpeg recipe uses `split=3` + `trim` on
  the three sections (head, middle, tail), then `blend=all_expr` to
  crossfade tail over head, then `concat` middle + blended section. See
  git history for the working filter.
- VP9 at CRF 30 absolutely destroys gradient content. CRF 20 is the floor
  for gradient-heavy material, and even then you need `-aq-mode 2` and
  grain injection (`noise=alls=6:allf=t`) to prevent visible banding.
- Crossfade duration tradeoff: too short = visible hard cut, too long =
  visible color-mixing ghost artifact. On this shader, 1-1.5s was the
  sweet spot. Neither looked as good as the live shader.
