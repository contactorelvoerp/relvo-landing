import { AgentFeed, CaseHeadline, CodeBlock, DtiBars, EmailPreview, Methods, Payment, PlanCard, Review, SlackMessage, SplitInvoice, TimelineCard, Usage } from './cards'
import { BarChart, Legend, LineChart, Waterfall } from './Charts'
import { BAR_COLORS, LINE_COLORS } from './colors'
import { labelsFor } from './labels'
import { HeroApp } from './HeroApp'
import { useSequence } from './useSequence'

// Renderiza un visual de la librería a partir de { id, data } (content/SCHEMA.md §3).
// Las tarjetas van dentro de la tarjeta blanca de UI (.ui); heroApp y composition ocupan todo el
// escenario del hero.
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
  slackMessage: SlackMessage,
  dtiBars: DtiBars,
}
const CHARTS = ['barChart', 'lineChart', 'waterfall']

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

// Contenido de un visual sin su tarjeta (lo usan .ui y las piezas de composition)
function Inner({ id, data, locale, caseData, label }) {
  if (id === 'caseHeadline') return <CaseHeadline c={caseData} />
  if (id === 'agentFeed') return <AgentFeed d={data} />
  if (CHARTS.includes(id)) return <Chart id={id} data={data} label={label} locale={locale === 'en' ? 'en-US' : 'es-CL'} />
  const Card = CARDS[id]
  return <Card d={data} l={labelsFor(locale)} />
}

// composition: 2 o 3 visuales superpuestos que aparecen en secuencia una sola vez
function Composition({ pieces, locale, caseData, label }) {
  const [stage] = useSequence(pieces.length - 1)
  return (
    <div ref={stage} className={`composition composition--${pieces.length}`}>
      {pieces.map((piece, i) => (
        <div key={piece.id + i} className={`hc composition__piece composition__piece--${i} composition__piece--${piece.id}`}>
          <Inner {...piece} locale={locale} caseData={caseData} label={label} />
        </div>
      ))}
    </div>
  )
}

export function Visual({ visual, locale, caseData, label }) {
  const { id, data } = visual
  if (id === 'heroApp') return <HeroApp d={data} l={labelsFor(locale)} />
  if (id === 'composition') return <Composition pieces={data.pieces} locale={locale} caseData={caseData} label={label} />
  return (
    <div className={`ui ui--${id}${CHARTS.includes(id) ? ' ui--chart' : ''}`}>
      <Inner id={id} data={data} locale={locale} caseData={caseData} label={label} />
    </div>
  )
}
