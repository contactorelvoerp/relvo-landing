// Datos del caso (content/<idioma>/clientes/<ref>.json) al formato del componente Case de la home
export function caseProps(c, l) {
  const note = c.dti.note.charAt(0).toLowerCase() + c.dti.note.slice(1)
  return {
    company: c.company, about: c.descriptor, big: c.headline.value, bigLabel: c.headline.label, bigSub: c.headline.sub,
    metricStrong: l.dti, metric: `, ${note}`, before: l.before, after: l.after, days: l.days,
    beforeDays: c.dti.before, afterDays: c.dti.after, quote: c.quote.short, author: c.quote.author, role: c.quote.role,
  }
}
