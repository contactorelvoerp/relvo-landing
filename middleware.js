import { next } from '@vercel/functions'
import { languageDecision } from './shared/language.js'

export const config = { matcher: ['/', '/en', '/en/'] }

export default function middleware(request) {
  const decision = languageDecision(request)
  const response = decision?.location
    ? new Response(null, { status: 307, headers: { Location: decision.location } })
    : next()
  if (decision?.cookie) response.headers.set('Set-Cookie', decision.cookie)
  if (decision?.location || decision?.cookie) response.headers.set('Cache-Control', 'private, no-store')
  return response
}
