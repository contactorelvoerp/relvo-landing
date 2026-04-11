import { Reveal } from './Reveal'
import { useEffect, useRef, useState } from 'react'
import { trackScheduleDemo, trackLeadCapture } from '../../utils/analytics'

const LEADS_STORAGE_KEY = 'relvo_leads_v1'

const parseStoredLeads = () => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(LEADS_STORAGE_KEY)
    const parsed = JSON.parse(raw || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveStoredLeads = (leads) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads))
}

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())

const escapeCsv = (value) => `"${String(value || '').replaceAll('"', '""')}"`
const toCsvContent = (leads) => [
  'email,createdAt',
  ...leads.map((lead) => `${escapeCsv(lead.email)},${escapeCsv(lead.createdAt)}`),
].join('\n')

const downloadLeadsCsv = (leads) => {
  if (!Array.isArray(leads) || !leads.length) return

  const blob = new Blob([toCsvContent(leads)], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)

  link.href = url
  link.setAttribute('download', `relvo-leads-${date}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const CTASection = ({ ctaHref, t }) => {
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState('')
  const inputRef = useRef(null)
  const title = String(t.ctaTitle || '')
  const highlight = String(t.ctaTitleHighlight || '').trim()
  const highlightIndex = highlight ? title.indexOf(highlight) : -1
  const hasHighlight = highlightIndex >= 0

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.relvoLeadsAdmin = {
      list: () => parseStoredLeads(),
      downloadCsv: () => downloadLeadsCsv(parseStoredLeads()),
      clear: () => window.localStorage.removeItem(LEADS_STORAGE_KEY),
    }

    return () => {
      delete window.relvoLeadsAdmin
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = String(email || '').trim()
    if (!trimmed) {
      setFeedback(t.ctaEmailRequired)
      inputRef.current?.focus()
      return
    }

    if (!isValidEmail(trimmed)) {
      setFeedback(t.ctaEmailInvalid)
      inputRef.current?.focus()
      return
    }

    const normalizedEmail = trimmed.toLowerCase()
    const nextLeads = parseStoredLeads()
    const alreadyExists = nextLeads.some(
      (lead) => String(lead?.email || '').toLowerCase() === normalizedEmail
    )

    if (alreadyExists) {
      setFeedback(t.ctaEmailExists)
      setEmail('')
      return
    }

    nextLeads.push({
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
    })

    saveStoredLeads(nextLeads)
    trackLeadCapture(normalizedEmail)
    setFeedback(t.ctaEmailSaved)
    setEmail('')
  }

  return (
    <section className="py-28 sm:py-36">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl tracking-[-0.04em] text-[var(--text-main)] sm:text-5xl sm:leading-[1.05]">
            {hasHighlight ? (
              <>
                {title.slice(0, highlightIndex)}
                <span className="relative inline-block px-1">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-[0.12em] h-[0.52em] rounded-[2px] bg-[var(--brand-warm)]"
                  />
                  <span className="relative z-10">{highlight}</span>
                </span>
                {title.slice(highlightIndex + highlight.length)}
              </>
            ) : (
              title
            )}
          </h2>

          <div className="mt-8 sm:mt-10">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackScheduleDemo('cta_section')}
              className="inline-flex h-11 items-center justify-center rounded-[var(--radius-button)] bg-[var(--text-main)] px-5 text-sm font-medium text-white shadow-[0_18px_40px_rgba(16,16,14,0.12)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
            >
              {t.ctaScheduleText}
            </a>
          </div>

          <div className="mx-auto mt-10 w-full max-w-2xl sm:mt-12">
            <p className="mb-5 text-base font-medium text-[var(--text-main)] sm:mb-6">
              {t.ctaCaptureLabel}
            </p>
            <form
              onSubmit={handleSubmit}
              className="rounded-[var(--radius-xl)] border border-black/[0.08] bg-white/60 p-2 shadow-[0_20px_50px_rgba(16,16,14,0.06)] backdrop-blur-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <label className="sr-only" htmlFor="cta-email">
                  {t.ctaEmailPlaceholder}
                </label>
                <input
                  ref={inputRef}
                  id="cta-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.ctaEmailPlaceholder}
                  className="h-11 w-full rounded-[var(--radius-button)] border border-black/[0.10] bg-transparent px-4 text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-soft)] focus:border-black/[0.16] focus:ring-2 focus:ring-[var(--focus-ring)] sm:flex-1 sm:border-transparent sm:focus:border-transparent"
                  autoComplete="work email"
                  inputMode="email"
                />
                <button
                  type="submit"
                  className="h-11 shrink-0 rounded-[var(--radius-button)] bg-[var(--text-main)] px-5 text-sm font-medium text-white shadow-[0_18px_40px_rgba(16,16,14,0.12)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
                >
                  {t.ctaSubmit}
                </button>
              </div>
            </form>
            <p className="mt-3 text-xs text-[var(--text-soft)]">{feedback || t.ctaHelper}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}