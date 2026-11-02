import '../../landing/landing.css'

// Línea de tiempo horizontal de 4 pasos (vertical en mobile, ver .steps3 en src/landing/landing.css):
// no una grilla de cards con íconos (regla cero del DS). Mismo patrón que Steps (src/landing/blocks.jsx),
// con un paso y un punto más en el riel.
export function Timeline({ steps }) {
  return (
    <>
      <ol className="steps3 steps3--4">
        {steps.map((s, i) => (
          <li key={s.title} className="steps3__step"><span className="steps3__n">{String(i + 1).padStart(2, '0')}</span><h3>{s.title}</h3><p>{s.text}</p></li>
        ))}
      </ol>
      <div className="steps3__rail steps3__rail--4" aria-hidden="true"><span /><span /><span /><span /></div>
    </>
  )
}
