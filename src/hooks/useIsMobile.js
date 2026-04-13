import { useEffect, useState } from 'react'

const QUERY = '(max-width: 767px)'

/**
 * Single source of truth for mobile breakpoint. Matches the `md:` Tailwind
 * breakpoint (768px) so CSS and JS decisions stay consistent.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : false
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const handler = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return isMobile
}
