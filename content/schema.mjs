// Schema de los archivos de contenido de las páginas de plantilla (ver content/SCHEMA.md).
// Lo usa scripts/validate-content.mjs en el build: un archivo que no cumple detiene el build.
import { z } from 'zod'

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length
const maxWords = (n) => z.string().min(1).refine((s) => words(s) <= n, { message: `máximo ${n} palabras` })
const wordRange = (min, max) => z.string().refine((s) => words(s) >= min && words(s) <= max, { message: `entre ${min} y ${max} palabras` })

const text = z.string().min(1)
const pair = z.tuple([text, text])
const tone = z.enum(['warn', 'neutral']).optional()
const step = z.object({ label: text, sub: text, done: z.boolean() })
const series = z.array(z.object({ name: text, values: z.array(z.number()).min(2) })).min(1)

// Librería de visuales: cada id con su `data` (SCHEMA.md §3)
const VISUAL_DATA = {
  heroApp: z.object({
    url: text,
    section: text,
    columns: z.array(text).length(3).optional(),
    kpi: z.object({ label: text, value: text, badge: text.optional() }),
    rows: z.array(z.object({ cols: z.array(text).min(1), status: text, tone })).min(1).max(3),
    card: z.object({ title: text, meta: text.optional(), amount: text, progress: z.number().min(0).max(1).optional(), line: pair.optional() }).optional(),
    toast: z.object({ title: text, sub: text }),
  }).strict(),
  planCard: z.object({
    plan: text,
    client: text.optional(),
    price: text,
    lines: z.array(pair).min(1),
    tiers: z.object({ t1: z.number(), t2: z.number(), labels: pair }).optional(),
    total: pair,
  }).strict(),
  timeline: z.object({ title: text, steps: z.array(step).min(2) }).strict(),
  splitInvoice: z.object({
    invoice: text,
    total: text,
    parts: z.array(z.object({ entity: text, amount: text, pct: z.number().positive() })).min(2),
    glosa: text,
  }).strict(),
  payment: z.object({
    invoice: text,
    badge: text.optional(),
    paid: text,
    total: text,
    progress: z.number().min(0).max(1),
    events: z.array(step).min(1),
  }).strict(),
  emailPreview: z.object({
    to: text,
    subject: text,
    body: text,
    cta: text.optional(),
    schedule: z.array(z.object({ label: text, tone })).min(1),
  }).strict(),
  methods: z.object({
    title: text,
    client: text.optional(),
    methods: z.array(z.object({ label: text, provider: text.optional(), selected: z.boolean().optional() })).min(2),
    total: pair,
  }).strict(),
  agentFeed: z.object({
    kpis: z.array(pair).optional(),
    items: z.array(z.tuple([z.enum(['doc', 'mail', 'hash', 'plug']), text, text])).min(1),
    review: z.object({ title: text, left: pair, right: pair, actions: z.array(text).min(1) }).optional(),
  }).strict(),
  usage: z.object({ unit: text, price: text, used: text, included: text, series: z.array(z.number()).min(7) }).strict(),
  barChart: z.object({ labels: z.array(text).min(2), series }).strict(),
  lineChart: z.object({ labels: z.array(text).min(2), series }).strict(),
  waterfall: z.object({ steps: z.array(z.union([z.tuple([text, z.number()]), z.tuple([text, z.number(), z.literal('base')])])).min(3) }).strict(),
  review: z.object({ title: text, left: pair, right: pair, actions: z.array(text).min(1) }).strict(),
  codeBlock: z.object({ lang: text, code: text, note: text }).strict(),
  caseHeadline: z.object({}).strict(),
  slackMessage: z.object({ channel: text, author: text, time: text.optional(), text, reply: z.object({ author: text, text }).strict() }).strict(),
  dtiBars: z.object({ before: z.number().int().positive(), after: z.number().int().positive(), label: text }).strict(),
  // composition: 2 o 3 visuales superpuestos (como el hero de la home); cada pieza se valida como visual
  composition: z.object({ pieces: z.array(z.object({ id: text, data: z.unknown() }).strict()).min(2).max(3) }).strict(),
}
const VISUAL_IDS = Object.keys(VISUAL_DATA)

const checkVisual = (v, ctx, path) => {
  if (!VISUAL_IDS.includes(v.id)) return ctx.addIssue({ code: 'custom', message: `visual desconocido: ${v.id}`, path: [...path, 'id'] })
  const result = VISUAL_DATA[v.id].safeParse(v.data)
  if (!result.success) for (const issue of result.error.issues) ctx.addIssue({ ...issue, path: [...path, 'data', ...issue.path] })
  else if (v.id === 'composition') v.data.pieces.forEach((piece, i) => (piece.id === 'composition'
    ? ctx.addIssue({ code: 'custom', message: 'composition no se anida', path: [...path, 'data', 'pieces', i] })
    : checkVisual(piece, ctx, [...path, 'data', 'pieces', i])))
}
const visual = z.object({ id: z.enum(VISUAL_IDS), data: z.unknown() }).strict().superRefine((v, ctx) => checkVisual(v, ctx, []))

const titled = { h2: text, h2Soft: maxWords(10).optional() }
const cta = z.object({ label: text, href: z.string().startsWith('/'), style: z.enum(['primary', 'secondary']) }).strict()

const BLOCKS = [
  // layout centered: obligatorio en las páginas internas (el hero de la home es el único a dos columnas)
  z.object({ type: z.literal('hero'), layout: z.literal('centered'), h1: text, lead: maxWords(30), intro: wordRange(40, 70).optional(), ctas: z.array(cta).min(1).max(2), visual }).strict(),
  z.object({ type: z.literal('beforeAfter'), ...titled, before: z.array(text).length(3), after: z.array(text).length(3) }).strict(),
  z.object({ type: z.literal('steps'), ...titled, steps: z.array(z.object({ title: text, text }).strict()).length(3) }).strict(),
  z.object({ type: z.literal('featureTabs'), ...titled, tabs: z.array(z.object({ label: text, desc: maxWords(8), visual }).strict()).min(3).max(4) }).strict(),
  z.object({ type: z.literal('capabilities'), ...titled, items: z.array(z.object({ title: text, text }).strict()).min(4).max(6) }).strict(),
  z.object({ type: z.literal('metrics'), ...titled, kpis: z.array(z.object({ label: text, value: text }).strict()).min(1).max(3), note: text.optional(), chart: visual.optional() }).strict(),
  z.object({ type: z.literal('case'), ref: text, h2: text, optional: z.boolean().optional() }).strict(),
  z.object({ type: z.literal('related'), ...titled, items: z.array(z.enum(['contratos', 'medicion', 'aprobaciones', 'cxc', 'agentes', 'reporteria'])).length(3) }).strict(),
  // SCHEMA.md pide de 4 a 6 preguntas; el contenido trae de 5 a 9. Más de 6 es un aviso del validador
  // (pendiente de confirmar con Ricardo), no un error.
  z.object({ type: z.literal('faq'), h2: text, items: z.array(z.object({ q: text, a: text }).strict()).min(4) }).strict(),
  z.object({ type: z.literal('quote'), ref: text, variant: z.enum(['full', 'short']) }).strict(),
  z.object({ type: z.literal('integrations') }).strict(),
  z.object({ type: z.literal('cta') }).strict(),
]
const block = z.discriminatedUnion('type', BLOCKS)

const caseData = z.object({
  company: text,
  descriptor: text,
  headline: z.object({ value: text, label: text, sub: text }).strict(),
  dti: z.object({ before: z.number(), after: z.number(), note: text }).strict(),
  quote: z.object({ short: text, full: text, author: text, role: text }).strict(),
}).strict()

export const pageSchema = z.object({
  id: text,
  preset: z.enum(['producto', 'solucion', 'caso']),
  seo: text,
  keyword: text,
  subnav: z.boolean().optional(),
  breadcrumb: z.array(z.object({ label: text, href: z.string().startsWith('/').optional() }).strict()).min(2),
  case: caseData.optional(),
  blocks: z.array(block).min(3),
}).strict()
  .refine((p) => p.blocks[0].type === 'hero', { message: 'el primer bloque es el hero', path: ['blocks', 0] })
  .refine((p) => p.preset !== 'caso' || p.case, { message: 'una página de caso trae sus datos en `case`', path: ['case'] })
