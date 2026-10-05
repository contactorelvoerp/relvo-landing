import { useEffect, useRef, useState } from 'react'

// Las piezas (.hc) aparecen en secuencia una sola vez al cargar; con movimiento reducido, todas a la
// vez. Sin JavaScript se ven todas (la clase .js del <html> es la que las oculta al inicio).
// Devuelve la ref del escenario y si la secuencia ya terminó.
export function useSequence(doneAfter) {
  const stage = useRef(null)
  const [done, setDone] = useState(false)
  useEffect(() => {
    const cards = [...stage.current.querySelectorAll('.hc')]
    const show = (i) => cards[i].classList.add('hc--in')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((_, i) => show(i))
      setDone(true)
      return undefined
    }
    const timers = cards.map((_, i) => setTimeout(() => show(i), 300 + i * 650))
    timers.push(setTimeout(() => setDone(true), 300 + doneAfter * 650 + 500))
    return () => timers.forEach(clearTimeout)
  }, [doneAfter])
  return [stage, done]
}
