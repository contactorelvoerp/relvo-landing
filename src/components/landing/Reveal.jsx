import { useEffect, useRef } from 'react'

export const Reveal = ({
  as: Tag = 'div',
  children,
  className = '',
  delayMs = 0,
  once = true,
}) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.style.transitionDelay = delayMs ? `${delayMs}ms` : ''

    if (typeof window === 'undefined') {
      el.classList.add('reveal--in')
      return
    }

    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced || !('IntersectionObserver' in window)) {
      el.classList.add('reveal--in')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('reveal--in')
          if (once) observer.unobserve(entry.target)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -15% 0px' }
    )

    observer.observe(el)

    // Fallback: reveal immediately if already in viewport.
    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0
      if (inView) el.classList.add('reveal--in')
    })

    return () => observer.disconnect()
  }, [delayMs, once])

  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()}>
      {children}
    </Tag>
  )
}

