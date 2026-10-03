import { getRoutes } from '../routes'
import { getDict } from '../i18n'
import { APOLLO_APP_ID, DEFAULT_LOCALE, GA_ID, LINKEDIN_URL, SITE_NAME, SITE_URL } from '../site'

const PRODUCT_PAGES = ['contratos', 'medicion', 'aprobaciones', 'cxc', 'agentes', 'reporteria']
const OG_LOCALE = { es: 'es_LA', en: 'en_US' }

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function absoluteUrl(path) {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
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
  if (route.id === 'home' || PRODUCT_PAGES.includes(route.id)) {
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
  return graph
}

// Devuelve el HTML del <head> de una ruta. `production` decide indexación y analítica;
// `ogImage` es la ruta pública de la imagen 1200×630 de la página, si existe.
export function buildHead(route, { production, ogImage }) {
  const indexable = production && route.status === 'live'
  const tags = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="robots" content="${indexable ? 'index, follow' : 'noindex, nofollow'}" />`,
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

  // Analítica solo en producción (los previews no ensucian las métricas de conversión) y recién
  // después de la carga, para no competir con el primer render. gtag() encola eventos desde el inicio.
  if (production) {
    tags.push(
      `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');addEventListener('load',function(){setTimeout(function(){function add(src,onload){var s=document.createElement('script');s.src=src;s.async=true;if(onload)s.onload=onload;document.head.appendChild(s)}add('https://www.googletagmanager.com/gtag/js?id=${GA_ID}');add('https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache='+Math.random().toString(36).substring(7),function(){window.trackingFunctions.onLoad({appId:'${APOLLO_APP_ID}'})})},1500)})</script>`,
    )
  }
  return tags.join('\n    ')
}
