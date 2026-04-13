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
    <section className="px-4 pt-24 pb-16 sm:px-6 sm:pt-40 sm:pb-20 md:pt-52 md:pb-28">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-6xl text-center">
          {/* Title — Fujiwara */}
          <h2
            className="mx-auto"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 4vw, 3.5rem)',
              fontWeight: 300,
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              color: '#000000',
            }}
          >
            {'Tú decides tus modelos de cobro,'}
            <br />
             {'deja que '}
            <img
              src="/relvo-wordmark-dark.svg"
              alt="relvo"
              className="inline-block align-baseline"
              style={{ height: '0.9em', marginLeft: '0.15em', marginRight: '0.1em' }}
            />
            <span
              className="px-[0.18em]"
              style={{
                background: 'linear-gradient(transparent 48%, #F4B08E 48%)',
                WebkitBoxDecorationBreak: 'clone',
                boxDecorationBreak: 'clone',
                borderRadius: '2px',
              }}
              >
            los opere
            </span>
            <br />
          </h2>

          {/* CTA button */}
          <div className="mt-10 sm:mt-12">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackScheduleDemo('cta_section')}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--text-main)] px-6 text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {t.ctaScheduleText}
            </a>
          </div>

          {/* Email capture */}
          <div className="mx-auto mt-10 w-full max-w-xl sm:mt-12">
            <p
              className="mb-5 sm:mb-6"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'clamp(1.1rem, 1.6vw, 1.3rem)',
                fontWeight: 500,
                color: 'var(--text-main)',
              }}
            >
              {t.ctaCaptureLabel}
            </p>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white/50 p-1.5 backdrop-blur-sm sm:rounded-full"
              style={{ border: '1px solid rgba(19,19,30,0.06)' }}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
                  className="h-10 w-full bg-transparent px-5 text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.9rem',
                  }}
                  autoComplete="work email"
                  inputMode="email"
                />
                <button
                  type="submit"
                  className="h-10 w-full shrink-0 rounded-full bg-[var(--text-main)] px-5 text-white sm:w-auto transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {t.ctaSubmit}
                </button>
              </div>
            </form>
            <p
              className="mt-3"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'clamp(0.8rem, 1vw, 0.9rem)',
                color: 'var(--text-soft)',
              }}
            >
              {feedback || t.ctaHelper}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
