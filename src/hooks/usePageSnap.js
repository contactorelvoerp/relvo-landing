import { useEffect, useRef } from 'react'

/**
 * Hijacks scroll on page 1 (first viewport) to snap to page 2.
 * Once on page 2 or below, releases control — normal scrolling resumes.
 * Only snaps once per visit (scroll down from page 1 → page 2).
 * Scrolling back up past page 2 top re-engages the snap.
 */
export function usePageSnap(targetRef) {
  const isSnapping = useRef(false)
  const hasSnapped = useRef(false)

  useEffect(() => {
    const target = targetRef?.current
    if (!target) return

    let lastScrollY = window.scrollY

    const handleWheel = (e) => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const targetTop = target.offsetTop

      // Only hijack if we're in the first page (above page 2)
      if (scrollY < targetTop - viewportHeight * 0.5 && e.deltaY > 0) {
        // Scrolling down while on page 1
        if (!isSnapping.current) {
          e.preventDefault()
          isSnapping.current = true
          hasSnapped.current = true

          target.scrollIntoView({ behavior: 'smooth' })

          // Release after animation completes
          setTimeout(() => {
            isSnapping.current = false
          }, 800)
        } else {
          e.preventDefault()
        }
      }

      // Re-engage if scrolled back to very top
      if (scrollY <= 10 && e.deltaY < 0) {
        hasSnapped.current = false
      }

      lastScrollY = scrollY
    }

    // Also handle touch for mobile
    let touchStartY = 0

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const targetTop = target.offsetTop
      const deltaY = touchStartY - e.touches[0].clientY

      if (scrollY < targetTop - viewportHeight * 0.5 && deltaY > 30) {
        if (!isSnapping.current) {
          e.preventDefault()
          isSnapping.current = true
          target.scrollIntoView({ behavior: 'smooth' })
          setTimeout(() => {
            isSnapping.current = false
          }, 800)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [targetRef])
}
