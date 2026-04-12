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

import { useEffect, useRef, useState } from 'react'

// Slot geometry — must mirror the stage-2 render. If you change scrollH,
// slotH, or bleed in render-stills.mjs, update these in lockstep.
const SLOT_HEIGHT = 1440    // logical viewport height per slot
const BLEED = 200           // overlap between adjacent slots
const SCROLL_H = 8000       // total landing scroll height rendered

const SLOTS = (() => {
  const numSlots = Math.ceil(SCROLL_H / SLOT_HEIGHT)
  return Array.from({ length: numSlots }, (_, i) => {
    const y0 = Math.max(0, i * SLOT_HEIGHT - BLEED)
    const y1 = Math.min(SCROLL_H, (i + 1) * SLOT_HEIGHT + BLEED)
    return { i, y0, y1, h: y1 - y0 }
  })
})()

export const BackgroundStatic = () => {
  // Slots 0 and 1 are always loaded so hero + first scroll look instant.
  // Entries beyond that get toggled on by their predecessor's IntersectionObserver.
  const [loadedUpTo, setLoadedUpTo] = useState(1)
  const slotRefs = useRef([])

  useEffect(() => {
    const observers = []
    SLOTS.forEach((slot, i) => {
      const el = slotRefs.current[i]
      if (!el) return
      // Watch every slot — when slot i becomes visible, ensure slot i+1 is loaded
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              setLoadedUpTo((prev) => Math.max(prev, i + 1))
            }
          }
        },
        { rootMargin: '400px 0px' } // start loading before scrolled fully into view
      )
      io.observe(el)
      observers.push(io)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

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
      {SLOTS.map((slot) => (
        <div
          key={slot.i}
          ref={(el) => (slotRefs.current[slot.i] = el)}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            // Each slot image covers y0..y1 of the 8000px render. The actual
            // pixel y-offset depends on the real viewport scale. We scale the
            // whole render so its total height equals 100% of the parent, and
            // position each slot proportionally within that 8000px space.
            top: `calc(${(slot.y0 / SCROLL_H) * 100}% )`,
            height: `calc(${(slot.h / SCROLL_H) * 100}%)`,
            overflow: 'hidden',
          }}
        >
          {slot.i <= loadedUpTo && (
            <img
              src={`/bg-slots/slot-${slot.i}.webp`}
              alt=""
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
