// Caso TGP (prototipo home v1): resultado principal, DTI antes y después, y la cita.
// "Leer el caso de TGP" queda fuera hasta que exista la página del caso.
const Bars = ({ count, on }) => (
  <div className={`case__bars${on ? ' case__bars--on' : ''}`} aria-hidden="true">
    {Array.from({ length: count }, (_, i) => <i key={i} />)}
  </div>
)

export function Case({ c }) {
  return (
    <div className="case">
      <div>
        <p className="case__company">
          <img src="/logos/clients/tgp.webp" alt={c.company} width="88" height="24" loading="lazy" />
          {c.about}
        </p>
        <p className="case__big">{c.big}</p>
        <p className="case__big-label">{c.bigLabel}</p>
        <p className="case__sub">{c.bigSub}</p>
      </div>
      <div>
        <p className="case__metric"><b>{c.metricStrong}</b>{c.metric}</p>
        <div className="case__dd case__dd--before">
          <div className="case__dd-label">{c.before}</div>
          <div className="case__dd-value"><b>6</b><small>{c.days}</small></div>
          <Bars count={6} />
        </div>
        <div className="case__dd">
          <div className="case__dd-label case__dd-label--on">{c.after}</div>
          <div className="case__dd-value"><b>3</b><small>{c.days}</small></div>
          <Bars count={3} on />
        </div>
      </div>
      <figure className="case__quote">
        <blockquote>“{c.quote}”</blockquote>
        <figcaption>{c.author}<span>{c.role}</span></figcaption>
      </figure>
    </div>
  )
}
