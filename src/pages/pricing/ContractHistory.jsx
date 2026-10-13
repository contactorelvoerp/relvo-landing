import { useState } from 'react'

// "Crece sin migrar": historial de un contrato ficticio. Cada versión es un botón (aria-pressed);
// la elegida cambia la factura y la etiqueta del plan. Arranca en la última versión, que es la que
// queda en el HTML del servidor. Sin animaciones.
export function ContractHistory({ c }) {
  const [sel, setSel] = useState(c.versions.length - 1)
  const cur = c.versions[sel]
  const custom = sel === c.versions.length - 1
  return (
    <figure className="pr-history">
      <figcaption className="pr-history__head">
        <span className="pr-history__customer">{c.customer}</span>
        <span className={`pr-history__plan${custom ? ' pr-history__plan--custom' : ''}`}>{cur.plan}</span>
        <span className="pr-history__sample">{c.sample}</span>
      </figcaption>
      <div className="pr-history__body">
        <div className="pr-history__versions" role="group" aria-label={c.historyLabel}>
          <p className="pr-history__label">{c.historyLabel}</p>
          {c.versions.map((v, i) => (
            <button key={v.when} type="button" className="pr-history__version" aria-pressed={i === sel} onClick={() => setSel(i)}>
              <span className="pr-history__when"><span className="num">{v.when}</span><span>{v.plan}</span></span>
              <span className="pr-history__title">{v.title}</span>
            </button>
          ))}
        </div>
        <div className="pr-invoice" aria-live="polite">
          <div className="pr-invoice__head">
            <span className="pr-invoice__title">{c.invoiceLabel}</span>
            <span className="pr-invoice__date num">{cur.date}</span>
          </div>
          <div className="pr-invoice__lines">
            {cur.lines.map((l) => (
              <div key={l.label} className="pr-invoice__line">
                <span className="pr-invoice__item">
                  {l.label}
                  <span className={`pr-invoice__detail num${l.usage ? ' pr-invoice__detail--usage' : ''}`}>{l.detail}</span>
                </span>
                <span className="num">{l.amount}</span>
              </div>
            ))}
            <div className="pr-invoice__total"><span>{c.total}</span><span className="num">{cur.total}</span></div>
          </div>
          <dl className="pr-invoice__meta">
            {c.meta.map((k, i) => (
              <div key={k}><dt>{k}</dt><dd>{cur.meta[i]}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </figure>
  )
}
