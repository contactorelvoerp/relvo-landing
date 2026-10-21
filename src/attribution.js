import { cleanAttribution, touchFromUrl } from '../shared/attribution.js'

const KEY = 'relvo.marketing.v1'
const TTL = 30 * 24 * 60 * 60 * 1000
let memory

// Explicit campaign touches replace latest touch; untagged navigation never does.
// A fixed 30-day window prevents quietly retaining a recipient forever.
export function captureAttribution(browser = window, now = new Date()) {
  let stored = memory
  try { stored = JSON.parse(browser.localStorage.getItem(KEY)) } catch { /* restricted storage */ }
  if (!stored || !Number.isFinite(stored.expires_at) || stored.expires_at <= now.getTime()) stored = { expires_at: now.getTime() + TTL }
  const previous = cleanAttribution(stored)
  const incoming = touchFromUrl(browser.location.href, now)
  const previousCampaign = { ...previous.last_touch, recorded_at: undefined }
  const incomingCampaign = { ...incoming, recorded_at: undefined }
  const current = incoming && JSON.stringify(previousCampaign) === JSON.stringify(incomingCampaign) ? previous.last_touch : incoming
  memory = { ...previous, first_touch: previous.first_touch ?? current, last_touch: current ?? previous.last_touch, expires_at: stored.expires_at }
  try { browser.localStorage.setItem(KEY, JSON.stringify(memory)) } catch { /* attribution still works within this document */ }
  return cleanAttribution(memory)
}
