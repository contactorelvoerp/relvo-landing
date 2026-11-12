import { hrefFor } from './routes'

// Only commercial context belongs in links and analytics, never contact details.
export function bookingContext(search) {
  const params = new URLSearchParams(search)
  const plan = ['startup', 'custom'].includes(params.get('plan')) ? params.get('plan') : 'undecided'
  const intent = plan === 'custom' && params.get('intent') === 'proposal' ? 'proposal' : 'demo'
  return { plan, intent, contact: intent === 'proposal' || params.get('contact') === '1' }
}

export function bookingHref(locale, { plan, intent = 'demo', contact = false } = {}) {
  const query = new URLSearchParams()
  if (['startup', 'custom'].includes(plan)) query.set('plan', plan)
  if (intent === 'proposal' && plan === 'custom') query.set('intent', intent)
  if (contact || intent === 'proposal') query.set('contact', '1')
  return `${hrefFor('demo', locale)}${query.size ? `?${query}` : ''}${contact || intent === 'proposal' ? '#consulta' : ''}`
}
