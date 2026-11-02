// Scroll a una sección con scrollIntoView propio, no el salto nativo del navegador (Ricardo,
// 2026-11-02: el salto nativo mide la posición al click, y contenido diferido debajo de esa
// sección —el embed de Cal.com, animaciones de entrada— puede mover el alto de la página después
// de esa medición, dejando el salto apuntando a un lugar que ya no es la correcta).
// scrollIntoView respeta el scroll-margin-top de cada página, y 3 reintentos espaciados corrigen
// la posición si algo debajo del click sigue cambiando de alto.
// Usado por los CTA de ancla de /lp/facturacion-b2b y /powered-by-relvo.
export function scrollToSection(id) {
  return (event) => {
    event.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    for (const delay of [400, 900, 1600]) {
      setTimeout(() => {
        if (Math.abs(target.getBoundingClientRect().top) > 4) target.scrollIntoView({ behavior: 'auto', block: 'start' })
      }, delay)
    }
  }
}
