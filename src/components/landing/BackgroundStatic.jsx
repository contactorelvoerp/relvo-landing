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

const SLOTS = (() => {
  const numSlots = Math.ceil(SCROLL_H / SLOT_HEIGHT)
  return Array.from({ length: numSlots }, (_, i) => {
    const y0 = Math.max(0, i * SLOT_HEIGHT - BLEED)
    const y1 = Math.min(SCROLL_H, (i + 1) * SLOT_HEIGHT + BLEED)
    return { i, y0, y1, h: y1 - y0 }
  })
})()

export const BackgroundStatic = () => {
  const slotRefs = useRef([])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {SLOTS.map((slot) => (
          <img
            key={slot.i}
            ref={(el) => (slotRefs.current[slot.i] = el)}
            src={`/bg-slots/slot-${slot.i}.webp`}
            alt=""
            draggable={false}
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '16 / 17',
              objectFit: 'fill',
              display: 'block',
              marginTop: slot.i === 0 ? 0 : `-${(BLEED / SLOT_HEIGHT) * 100}%`,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}
