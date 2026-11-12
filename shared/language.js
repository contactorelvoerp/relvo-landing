const LANGUAGE_COOKIE = 'relvo_language'
const SPANISH_COUNTRIES = new Set(['AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'ES', 'GQ', 'GT', 'HN', 'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE'])

export function languageCookie(locale, secure = false) {
  return `${LANGUAGE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secure ? '; Secure' : ''}`
}

// Only infer language at the entry point. Explicit localized URLs stay shareable.
export function languageDecision(request) {
  const url = new URL(request.url)
  if (!['/', '/en', '/en/'].includes(url.pathname) || !['GET', 'HEAD'].includes(request.method)) return null
  if (/bot|crawler|spider|slurp|facebookexternalhit|twitterbot|linkedinbot/i.test(request.headers.get('user-agent') ?? '')) return null
  const explicit = url.searchParams.get('lang')
  const chosen = ['es', 'en'].includes(explicit) ? explicit : null
  const saved = request.headers.get('cookie')?.match(/(?:^|;\s*)relvo_language=(es|en)(?:;|$)/)?.[1]
  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase()
  const browser = (request.headers.get('accept-language') ?? '').split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(';')
      const quality = params.find((param) => param.trim().startsWith('q='))
      return { language: tag.split('-')[0], q: quality ? Number(quality.trim().slice(2)) : 1 }
    })
    .filter(({ language, q }) => ['es', 'en'].includes(language) && q > 0 && q <= 1)
    .sort((a, b) => b.q - a.q)[0]?.language
  const locale = chosen ?? saved ?? (country && /^[A-Z]{2}$/.test(country) ? (SPANISH_COUNTRIES.has(country) ? 'es' : 'en') : browser ?? 'es')
  const decision = { cookie: chosen ? languageCookie(chosen, url.protocol === 'https:') : null, location: null }
  if (url.pathname === '/' && locale === 'en') {
    url.pathname = '/en'
    decision.location = url.href
  }
  return decision
}
