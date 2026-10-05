import { AgentFeed, CaseHeadline, CodeBlock, EmailPreview, Methods, Payment, PlanCard, Review, SplitInvoice, TimelineCard, Usage } from './cards'
import { BarChart, Legend, LineChart, Waterfall } from './Charts'
import { BAR_COLORS, LINE_COLORS } from './colors'
import { labelsFor } from './labels'
import { HeroApp } from './HeroApp'

// Renderiza un visual de la librería a partir de { id, data } (content/SCHEMA.md §3).
// Las tarjetas van dentro de la tarjeta blanca de UI (.ui); heroApp ocupa todo el escenario del hero.
const CARDS = {
  planCard: PlanCard,
  timeline: TimelineCard,
  splitInvoice: SplitInvoice,
  payment: Payment,
  emailPreview: EmailPreview,
  methods: Methods,
  usage: Usage,
  review: Review,
  codeBlock: CodeBlock,
}

export function Chart({ id, data, label, locale }) {
  if (id === 'waterfall') return <div className="chart"><Waterfall steps={data.steps} label={label} locale={locale} /></div>
  const Svg = id === 'barChart' ? BarChart : LineChart
  const colors = id === 'barChart' ? BAR_COLORS : LINE_COLORS
  return (
    <div className="chart">
      <Svg labels={data.labels} series={data.series} label={label} />
      <Legend names={data.series.map((s) => s.name)} colors={colors} />
    </div>
  )
}

export function Visual({ visual, locale, caseData, label }) {
  const { id, data } = visual
  const l = labelsFor(locale)
  if (id === 'heroApp') return <HeroApp d={data} l={l} />
  if (id === 'caseHeadline') return <div className="ui ui--case"><CaseHeadline c={caseData} /></div>
  // La etiqueta de ejemplo la pone el escenario o el panel que contiene al visual
  if (id === 'agentFeed') return <div className="ui ui--feed"><AgentFeed d={data} /></div>
  if (id === 'barChart' || id === 'lineChart' || id === 'waterfall') {
    return <div className="ui ui--chart"><Chart id={id} data={data} label={label} locale={locale === 'en' ? 'en-US' : 'es-CL'} /></div>
  }
  const Card = CARDS[id]
  return <div className={`ui ui--${id}`}><Card d={data} l={l} /></div>
}
