/**
 * BackgroundStatic — stitched pre-rendered shader stills.
 *
 * Replaces the live RelvoGradient (too GPU-heavy on desktop) with static
 * slot images cropped from a single deterministic shader render at
 * u_time=0. Each slot covers a slice of the landing's scroll height with
 * a 200px bleed overlap to its neighbors so the stitch is invisible.
 *
 * Lazy loading: slot 0 (hero) and slot 1 mount eagerly on page load. Each
 * slot has an IntersectionObserver watching it — when slot i enters the
 * viewport, slot i+1 gets marked visible (triggers its <img> to render).
 * This keeps initial page weight small while making sure the next slot is
 * already loading before the user scrolls to it.
 *
 * The renders live in public/bg-slots/. Re-generate via:
 *   node scripts/shader-video-experiments/render-stills.mjs --final --frame=0 --scrollH=8000
 */
import { useRef } from 'react'

// Slot geometry — must mirror the stage-2 render. If you change scrollH,
// slotH, or bleed in render-stills.mjs, update these in lockstep.
const SLOT_HEIGHT = 1440
const BLEED = 200
const SCROLL_H = 8000
// Native rendered slot dimensions. Middle slots (1-4) are 2560×1840,
// edge slots (0, 5) are shorter because the renderer truncates the
// outer bleed at the document edges. We use these exact dimensions to
// preserve the original aspect ratio when stretching to viewport width.
const SLOT_NATIVE_W = 2560
const SLOT_NATIVE_DIMS = {
  0: { w: 2560, h: 1640 }, // hero edge — only bottom bleed
  1: { w: 2560, h: 1840 },
  2: { w: 2560, h: 1840 },
  3: { w: 2560, h: 1840 },
  4: { w: 2560, h: 1840 },
  5: { w: 2560, h: 1000 }, // tail edge — truncated
}
// Adjacent slots share 2*BLEED pixels (each one carries the full bleed
// region of the boundary). CSS margin percentage resolves against the
// container's WIDTH, so we compute the overlap as a fraction of width.
const BLEED_OVERLAP_PCT = (2 * BLEED / SLOT_NATIVE_W) * 100

const SLOTS = (() => {
  const numSlots = Math.ceil(SCROLL_H / SLOT_HEIGHT)
  return Array.from({ length: numSlots }, (_, i) => {
    const y0 = Math.max(0, i * SLOT_HEIGHT - BLEED)
    const y1 = Math.min(SCROLL_H, (i + 1) * SLOT_HEIGHT + BLEED)
    return { i, y0, y1, h: y1 - y0 }
  })
})()

// How many alternating passes to stack (original + mirror + original + …).
// More passes = more vertical canvas. Each pass costs ~6 decoded images.
const N_PASSES = 6

// For a given pass index, return the slots in the order they should render
// for that pass. Even passes (0, 2, 4…) are original; odd are reversed
// (to be mirrored via scaleY(-1)).
const passSlots = (passIdx) =>
  passIdx % 2 === 0 ? SLOTS : [...SLOTS].reverse()

export const BackgroundStatic = () => {
  const slotRefs = useRef([])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {Array.from({ length: N_PASSES }).map((_, passIdx) =>
          passSlots(passIdx).map((slot, slotIdx) => {
            const isMirrored = passIdx % 2 === 1
            // Pass boundaries (first image of each pass after the first)
            // get 0 margin so the last row of the previous pass matches
            // the first row of this one (because it's the same image
            const isPassBoundary = passIdx > 0 && slotIdx === 0
            const isFirstSlot = passIdx === 0 && slotIdx === 0
            const marginTop =
              isPassBoundary || isFirstSlot ? '0' : `-${BLEED_OVERLAP_PCT}%`
            const refCb =
              passIdx === 0 ? (el) => (slotRefs.current[slot.i] = el) : undefined
            const dims = SLOT_NATIVE_DIMS[slot.i] || { w: 2560, h: 1840 }
            return (
              <img
                key={`p${passIdx}-${slot.i}`}
                ref={refCb}
                src={`/bg-slots/slot-${slot.i}.webp`}
                alt=""
                draggable={false}
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: `${dims.w} / ${dims.h}`,
                  objectFit: 'fill',
                  display: 'block',
                  marginTop,
                  transform: isMirrored ? 'scaleY(-1)' : undefined,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            )
          }),
        )}
      </div>
    </div>
  )
}
