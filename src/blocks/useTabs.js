import { useRef, useState } from 'react'

// Tabs accesibles (patrón WAI-ARIA): tabindex itinerante y flechas, Inicio y Fin para moverse.
// Todos los paneles se renderizan en el HTML; los inactivos van con `hidden`.
export function useTabs(prefix, count) {
  const [active, setActive] = useState(0)
  const refs = useRef([])

  const select = (i, focus) => {
    setActive(i)
    if (focus) refs.current[i]?.focus()
  }
  const onKeyDown = (i) => (e) => {
    const keys = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: count - 1 }
    if (!(e.key in keys)) return
    e.preventDefault()
    select((keys[e.key] + count) % count, true)
  }

  return {
    active,
    tab: (i) => ({
      ref: (el) => { refs.current[i] = el },
      role: 'tab',
      type: 'button',
      id: `${prefix}-tab-${i}`,
      'aria-selected': active === i,
      'aria-controls': `${prefix}-panel-${i}`,
      tabIndex: active === i ? 0 : -1,
      onClick: () => select(i),
      onKeyDown: onKeyDown(i),
    }),
    panel: (i) => ({
      role: 'tabpanel',
      id: `${prefix}-panel-${i}`,
      'aria-labelledby': `${prefix}-tab-${i}`,
      hidden: active !== i,
    }),
  }
}
