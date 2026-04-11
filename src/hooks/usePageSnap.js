import { useEffect, useRef } from 'react'

/**
 * Hijacks scroll across multiple snap pages.
 * Each ref in the array is a snap target. Scrolling within the snap zone
 * snaps to the nearest page boundary. Once past the last snap page,
 * normal scrolling resumes.
 *
 * @param {React.RefObject[]} pageRefs - array of refs to snap-page elements
 */
export function usePageSnap(pageRefs) {
  const isSnapping = useRef(false)

  useEffect(() => {
    if (!pageRefs?.length) return

    const getPageTops = () =>
      pageRefs.map((ref) => ref.current?.offsetTop ?? 0)

    const getLastSnapBottom = () => {
      const last = pageRefs[pageRefs.length - 1]?.current
      if (!last) return 0
      return last.offsetTop + last.offsetHeight
    }

    const findCurrentPage = (scrollY, pageTops) => {
      const vh = window.innerHeight
      for (let i = pageTops.length - 1; i >= 0; i--) {
        if (scrollY >= pageTops[i] - vh * 0.3) return i
      }
      return 0
    }

    const snapTo = (target) => {
      if (isSnapping.current) return
      isSnapping.current = true
      target.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => {
        isSnapping.current = false
      }, 700)
    }

    const handleWheel = (e) => {
      if (isSnapping.current) {
        e.preventDefault()
        return
      }

      const scrollY = window.scrollY
      const lastSnapBottom = getLastSnapBottom()

      // Past the snap zone — let normal scrolling happen
      if (scrollY >= lastSnapBottom - window.innerHeight * 0.5 && e.deltaY > 0) {
        return
      }

      const pageTops = getPageTops()
      const currentPage = findCurrentPage(scrollY, pageTops)

      if (e.deltaY > 0) {
        // Scrolling down
        const nextPage = currentPage + 1
        if (nextPage < pageRefs.length && pageRefs[nextPage].current) {
          e.preventDefault()
          snapTo(pageRefs[nextPage].current)
        } else if (nextPage >= pageRefs.length) {
          // Snap zone ended, scroll freely
          return
        }
      } else if (e.deltaY < 0) {
        // Scrolling up
        if (scrollY <= pageTops[0] + 10) return // already at top

        // If we're in the snap zone, snap to previous page
        if (scrollY < lastSnapBottom) {
          const prevPage = Math.max(0, currentPage - 1)
          if (pageRefs[prevPage].current) {
            e.preventDefault()
            snapTo(pageRefs[prevPage].current)
          }
        }
      }
    }

    // Touch handling
    let touchStartY = 0

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      if (isSnapping.current) {
        e.preventDefault()
        return
      }

      const scrollY = window.scrollY
      const lastSnapBottom = getLastSnapBottom()
      const deltaY = touchStartY - e.touches[0].clientY

      if (scrollY >= lastSnapBottom - window.innerHeight * 0.5 && deltaY > 0) {
        return
      }

      const pageTops = getPageTops()
      const currentPage = findCurrentPage(scrollY, pageTops)

      if (Math.abs(deltaY) > 30) {
        if (deltaY > 0) {
          const nextPage = currentPage + 1
          if (nextPage < pageRefs.length && pageRefs[nextPage].current) {
            e.preventDefault()
            snapTo(pageRefs[nextPage].current)
          }
        } else {
          if (scrollY < lastSnapBottom) {
            const prevPage = Math.max(0, currentPage - 1)
            if (pageRefs[prevPage].current) {
              e.preventDefault()
              snapTo(pageRefs[prevPage].current)
            }
          }
        }
        touchStartY = e.touches[0].clientY
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
  }, [pageRefs])
}
