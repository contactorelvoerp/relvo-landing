import { getRoutes } from '../routes'
import { getContent } from '../content'
import { getDict } from '../i18n'
import { answeredFaq } from '../pages/pricing/copy'
import { APOLLO_APP_ID, DEFAULT_LOCALE, GA_ID, LINKEDIN_URL, SITE_NAME, SITE_URL } from '../site'

const OG_LOCALE = { es: 'es_LA', en: 'en_US' }

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function absoluteUrl(path) {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
}

// Para que los motores de búsqueda e IA no confundan a Relvo con software de cuentas por pagar
// ni con otras empresas llamadas Relvo. Solo va en datos estructurados (no es copy visible).
const ORG_DISAMBIGUATION = {
  es: 'Software de cuentas por cobrar para empresas B2B que venden y facturan, no de cuentas por pagar: automatiza contratos, medición de uso, facturación electrónica, cobranza y conciliación bancaria para SaaS e IA en LatAm.',
  en: 'Accounts receivable software for B2B companies that sell and invoice, not accounts payable: it automates contracts, usage metering, e-invoicing, collections and bank reconciliation for SaaS and AI companies in LatAm.',
}

function homeDescription(locale) {
  const home = getRoutes().find((r) => r.id === 'home' && r.locale === locale)
  return home ? home.description : undefined
}

function jsonLd(route) {
  const org = `${SITE_URL}/#organization`
  const graph = [
    {
      '@type': 'Organization',
      '@id': org,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/logo-logotype-dark.svg`,
      description: homeDescription(route.locale),
      disambiguatingDescription: ORG_DISAMBIGUATION[route.locale] || ORG_DISAMBIGUATION.es,
      sameAs: [LINKEDIN_URL],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      inLanguage: route.locale,
      publisher: { '@id': org },
    },
  ]
  if (route.status !== 'live') return graph

  const url = absoluteUrl(route.path)
  const page = getContent(route.locale, route.path)
  if (page) return [...graph, ...landingLd(page, route, url, org)]
  if (route.id === 'home' || route.id === 'powered_by') {
    graph.push({
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      url,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: route.description,
      provider: { '@id': org },
    })
  }
  if (route.id !== 'home') {
    const home = getRoutes().find((r) => r.id === 'home' && r.locale === route.locale)
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: absoluteUrl(home ? home.path : '/') },
        { '@type': 'ListItem', position: 2, name: getDict(route.locale).pages[route.id].name, item: url },
      ],
    })
  }
  // Precios: solo las preguntas con respuesta aprobada (las [PENDIENTE] no se publican)
  if (route.id === 'precios') {
    const faq = answeredFaq(route.locale)
    if (faq.length) graph.push(faqLd(faq))
  }
  return graph
}

// Páginas de plantilla (content/SCHEMA.md §5): BreadcrumbList desde las migas visibles,
// SoftwareApplication en producto y solución, y FAQPage con exactamente el texto visible de la FAQ.
// Una miga intermedia sin página publicada no entra al BreadcrumbList (no se enlaza a una URL que no existe).
function landingLd(page, route, url, org) {
  const live = (path) => getRoutes().some((r) => r.path === path && r.status === 'live' && !r.noindex)
  const crumbs = page.breadcrumb.filter((c, i) => i === page.breadcrumb.length - 1 || (c.href && live(c.href)))
  const ld = [{
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem', position: i + 1, name: c.label,
      item: i === crumbs.length - 1 ? url : absoluteUrl(c.href),
    })),
  }]
  if (page.preset !== 'caso') {
    ld.push({
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      url,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: route.description,
      provider: { '@id': org },
    })
  }
  const faq = page.blocks.find((b) => b.type === 'faq')
  if (faq) {
    ld.push(faqLd(faq.items))
  }
  return ld
}

function faqLd(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } })),
  }
}

// Devuelve el HTML del <head> de una ruta. `production` decide indexación y analítica;
// `ogImage` es la ruta pública de la imagen 1200×630 de la página, si existe.
export function buildHead(route, { production, ogImage }) {
  const indexable = production && route.status === 'live' && !route.noindex
  const tags = [
    `<title>${esc(route.title)}</title>`,
    // Las páginas en preparación (noindex) dejan seguir sus links en producción
    `<meta name="robots" content="${indexable ? 'index, follow' : production && route.noindex ? 'noindex, follow' : 'noindex, nofollow'}" />`,
  ]
  if (route.description) tags.push(`<meta name="description" content="${esc(route.description)}" />`)

  if (route.status === 'live') {
    const url = absoluteUrl(route.path)
    tags.push(`<link rel="canonical" href="${url}" />`)

    const alternates = getRoutes().filter((r) => r.id === route.id && r.status === 'live')
    for (const alt of alternates) {
      tags.push(`<link rel="alternate" hreflang="${alt.locale}" href="${absoluteUrl(alt.path)}" />`)
    }
    const fallback = alternates.find((r) => r.locale === DEFAULT_LOCALE)
    if (fallback) tags.push(`<link rel="alternate" hreflang="x-default" href="${absoluteUrl(fallback.path)}" />`)

    tags.push(
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="${SITE_NAME}" />`,
      `<meta property="og:locale" content="${OG_LOCALE[route.locale]}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:title" content="${esc(route.title)}" />`,
      `<meta property="og:description" content="${esc(route.description)}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${esc(route.title)}" />`,
      `<meta name="twitter:description" content="${esc(route.description)}" />`,
    )
    if (ogImage) {
      const image = `${SITE_URL}${ogImage}`
      tags.push(
        `<meta property="og:image" content="${image}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="${esc(route.title)}" />`,
        `<meta name="twitter:image" content="${image}" />`,
      )
    }
  }

  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonLd(route) }).replace(/</g, '\\u003c')
  tags.push(`<script type="application/ld+json">${ld}</script>`)

  // Previews never load tracking. The client captures and sanitizes attribution
  // before configuring GA or loading third-party scripts.
  if (production) tags.push(`<script>window.__RELVO_ANALYTICS__=${JSON.stringify({ measurementId: GA_ID, apolloAppId: APOLLO_APP_ID })}</script>`)
  return tags.join('\n    ')
}
