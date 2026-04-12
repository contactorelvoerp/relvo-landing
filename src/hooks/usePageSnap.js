import { useEffect, useRef } from 'react'

/**
 * Snap-scroll between pages. Uses CSS scroll-behavior for the actual
 * animation (letting the browser handle it natively) and just
 * prevents default scroll + sets scrollTop to trigger it.
 */
export function usePageSnap(pageRefs, exitRef) {
  const isSnapping = useRef(false)
  const wheelAccum = useRef(0)
  const wheelTimer = useRef(null)

  useEffect(() => {
    if (!pageRefs?.length) return

    // Temporarily enable smooth scroll on html for our snaps
    const html = document.documentElement
    const origBehavior = html.style.scrollBehavior

    const getPageTops = () =>
      pageRefs.map((ref) => ref.current?.offsetTop ?? 0)

    const getLastSnapBottom = () => {
      const last = pageRefs[pageRefs.length - 1]?.current
      if (!last) return 0
      return last.offsetTop + last.offsetHeight
    }

    const findCurrentPage = (scrollY, pageTops) => {
      for (let i = pageTops.length - 1; i >= 0; i--) {
        if (scrollY >= pageTops[i] - window.innerHeight * 0.3) return i
      }
      return 0
    }

    const snapTo = (target) => {
      if (isSnapping.current) return
      isSnapping.current = true

      html.style.scrollBehavior = 'smooth'
      window.scrollTo(0, target.offsetTop)

      // Wait for scroll to finish, then release
      const checkDone = () => {
        const diff = Math.abs(window.scrollY - target.offsetTop)
        if (diff < 2) {
          html.style.scrollBehavior = origBehavior
          setTimeout(() => { isSnapping.current = false }, 50)
        } else {
          requestAnimationFrame(checkDone)
        }
      }
      // Start checking after a small delay to let scroll begin
      setTimeout(() => requestAnimationFrame(checkDone), 50)

      // Safety timeout
      setTimeout(() => {
        html.style.scrollBehavior = origBehavior
        isSnapping.current = false
      }, 1200)
    }

    const handleWheel = (e) => {
      if (isSnapping.current) {
        e.preventDefault()
        return
      }

      const scrollY = window.scrollY
      const lastSnapBottom = getLastSnapBottom()

      // At or past the snap zone — free scrolling (down)
      if (scrollY >= lastSnapBottom - 10 && e.deltaY > 0) return

      // Well past the snap zone — free scrolling (both directions)
      if (scrollY > lastSnapBottom + window.innerHeight * 0.3) return

      // Near boundary scrolling up — snap to last snap page
      if (scrollY > lastSnapBottom - window.innerHeight * 0.2 && e.deltaY < 0) {
        const lastPage = pageRefs.length - 1
        if (pageRefs[lastPage].current) {
          e.preventDefault()
          snapTo(pageRefs[lastPage].current)
        }
        return
      }

      // Below snap zone scrolling down — free
      if (scrollY > lastSnapBottom) return

      const pageTops = getPageTops()
      const currentPage = findCurrentPage(scrollY, pageTops)

      // On last snap page scrolling down — snap to exit then free scroll
      if (currentPage >= pageRefs.length - 1 && e.deltaY > 0) {
        if (exitRef?.current) {
          e.preventDefault()
          snapTo(exitRef.current)
        }
        return
      }

      // Accumulate wheel delta to avoid triggering on tiny scroll
      e.preventDefault()
      wheelAccum.current += e.deltaY

      clearTimeout(wheelTimer.current)
      wheelTimer.current = setTimeout(() => {
        const delta = wheelAccum.current
        wheelAccum.current = 0

        if (Math.abs(delta) < 10) return

        const pageTops2 = getPageTops()
        const currentPage2 = findCurrentPage(window.scrollY, pageTops2)

        if (delta > 0) {
          const nextPage = currentPage2 + 1
          if (nextPage < pageRefs.length && pageRefs[nextPage].current) {
            snapTo(pageRefs[nextPage].current)
          }
        } else {
          if (window.scrollY <= pageTops2[0] + 10) return
          const prevPage = Math.max(0, currentPage2 - 1)
          if (pageRefs[prevPage].current) {
            snapTo(pageRefs[prevPage].current)
          }
        }
      }, 80)
    }

    // Touch handling
    let touchStartY = 0

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e) => {
      if (isSnapping.current) return

      const deltaY = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(deltaY) < 40) return

      const scrollY = window.scrollY
      const lastSnapBottom = getLastSnapBottom()

      if (scrollY > lastSnapBottom + window.innerHeight * 0.3) return

      if (scrollY > lastSnapBottom - window.innerHeight * 0.2 && deltaY < 0) {
        const lastPage = pageRefs.length - 1
        if (pageRefs[lastPage].current) snapTo(pageRefs[lastPage].current)
        return
      }

      if (scrollY > lastSnapBottom) return

      const pageTops = getPageTops()
      const currentPage = findCurrentPage(scrollY, pageTops)

      if (deltaY > 0) {
        const nextPage = currentPage + 1
        if (nextPage < pageRefs.length && pageRefs[nextPage].current) {
          snapTo(pageRefs[nextPage].current)
        } else if (nextPage >= pageRefs.length && exitRef?.current) {
          snapTo(exitRef.current)
        }
      } else {
        if (scrollY <= pageTops[0] + 10) return
        const prevPage = Math.max(0, currentPage - 1)
        if (pageRefs[prevPage].current) snapTo(pageRefs[prevPage].current)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      html.style.scrollBehavior = origBehavior
      clearTimeout(wheelTimer.current)
    }
  }, [pageRefs, exitRef])
}
