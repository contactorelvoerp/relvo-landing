import { useEffect, useState } from 'react'

const PALETTES = ['dawn', 'day', 'sunset', 'night']

function localPalette() {
  const preview = new URLSearchParams(window.location.search).get('heroPalette')
  if (PALETTES.includes(preview)) return preview
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 10) return 'dawn'
  if (hour >= 10 && hour < 17) return 'day'
  if (hour >= 17 && hour < 21) return 'sunset'
  return 'night'
}

export function useHeroPalette(enabled = true) {
  const [palette, setPalette] = useState('day')

  useEffect(() => {
    if (!enabled) return
    const update = () => setPalette(localPalette())
    update()
    const timer = window.setInterval(update, 60_000)
    return () => window.clearInterval(timer)
  }, [enabled])

  return palette
}
