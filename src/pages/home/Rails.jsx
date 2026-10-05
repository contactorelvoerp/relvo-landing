import { FeatureTabs } from '../../blocks/FeatureTabs'

// 01 Rieles (prototipo home v2): 4 tabs verticales con las pantallas de la librería de visuales:
// plan con tramos de tokens, aprobación con checks, factura dividida y cobro parcial.
const VISUALS = [['planCard', 'pricing'], ['timeline', 'approvals'], ['splitInvoice', 'split'], ['payment', 'collection']]

export function Rails({ c, locale }) {
  const tabs = c.tabs.map((tab, i) => ({ label: tab.title, desc: tab.desc, visual: { id: VISUALS[i][0], data: c[VISUALS[i][1]] } }))
  return <FeatureTabs prefix="rieles" tablist={c.tablist} tabs={tabs} locale={locale} />
}
