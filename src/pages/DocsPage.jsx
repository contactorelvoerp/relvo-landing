import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Bell,
  Box,
  FileText,
  Gauge,
  Settings,
  ShieldCheck,
  UserRound,
  Waves,
  Receipt,
} from 'lucide-react'
import { MarkdownRenderer } from '../components/docs/MarkdownRenderer'
import {
  docsNavigation,
  getDocEntry,
  getRouteForDocPath,
  getTableOfContents,
} from '../docs/docsContent'

const iconMap = {
  'Panel': Gauge,
  'Clientes': UserRound,
  'Contratos': FileText,
  'Uso': Waves,
  'Facturación': Receipt,
  'Aprobaciones': ShieldCheck,
  'Notificaciones': Bell,
  'Pricing': Box,
  'Configuración': Settings,
}

const SidebarItem = ({ item, currentDocPath, navigate, onNavigate, level = 0 }) => {
  const href = getRouteForDocPath(item.docPath)
  const isActive = item.docPath === currentDocPath
  const childActive = (item.children ?? []).some((child) => child.docPath === currentDocPath)
  const Icon = iconMap[item.label]

  return (
    <div>
      <a
        href={href}
        onClick={(event) => {
          event.preventDefault()
          onNavigate?.()
          navigate?.(href)
        }}
        className={`flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 transition ${
          isActive || childActive
            ? 'bg-[rgba(19,19,30,0.05)] text-[var(--text-main)]'
            : 'text-[var(--text-soft)] hover:bg-[rgba(19,19,30,0.03)] hover:text-[var(--text-main)]'
        }`}
        style={{
          paddingLeft: level > 0 ? '1rem' : undefined,
          fontFamily: 'var(--font-ui)',
          fontSize: level > 0 ? '0.9rem' : '1rem',
          fontWeight: isActive || childActive ? 600 : 500,
        }}
      >
        {Icon ? <Icon size={18} strokeWidth={1.8} /> : <span className="w-[18px]" />}
        <span>{item.label}</span>
      </a>

      {item.children?.length ? (
        <div className="mt-1 space-y-1 border-l border-[rgba(19,19,30,0.07)] pl-3">
          {item.children.map((child) => (
            <SidebarItem
              key={child.docPath}
              item={child}
              currentDocPath={currentDocPath}
              navigate={navigate}
              onNavigate={onNavigate}
              level={level + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

const DocsSidebar = ({ currentDocPath, navigate, mobile = false, onNavigate }) => (
  <nav className={mobile ? 'space-y-7' : 'space-y-8'}>
    {docsNavigation.map((section) => (
      <div key={section.title}>
        <p
          className="mb-3 uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 500,
            letterSpacing: '0.14em',
            color: 'var(--text-muted)',
          }}
        >
          {section.title}
        </p>
        <div className="space-y-1.5">
          {section.items.map((item) => (
            <SidebarItem
              key={item.docPath}
              item={item}
              currentDocPath={currentDocPath}
              navigate={navigate}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    ))}
  </nav>
)

export const DocsPage = ({ pathname, navigate }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const entry = useMemo(() => getDocEntry(pathname), [pathname])
  const toc = useMemo(() => getTableOfContents(entry.content), [entry.content])

  useEffect(() => {
    window.scrollTo(0, 0)
    setMobileNavOpen(false)
  }, [entry.docPath])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fcfcf8] text-[var(--text-main)]">
      <Helmet>
        <title>{entry.title} | Relvo Docs</title>
        <meta
          name="description"
          content="Documentación de usuario final de Relvo para equipos de operaciones comerciales, revenue ops y finanzas."
        />
      </Helmet>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at top left, rgba(208,255,11,0.14), transparent 28%),
            radial-gradient(circle at top right, rgba(255,149,102,0.18), transparent 24%),
            linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.98))
          `,
        }}
      />

      <header className="sticky top-0 z-40 border-b border-[rgba(19,19,30,0.06)] bg-[rgba(252,252,248,0.84)] backdrop-blur-xl">
        <div className="section-shell flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <a
              href="/"
              onClick={(event) => {
                event.preventDefault()
                navigate?.('/')
              }}
              className="flex items-center gap-3"
            >
              <img src="/relvo-wordmark-dark.svg" alt="relvo" className="h-5 w-auto sm:h-6" />
              <span
                className="hidden rounded-full border border-[rgba(19,19,30,0.08)] bg-white/75 px-3 py-1 sm:inline-flex"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-soft)',
                }}
              >
                Docs
              </span>
            </a>

            <button
              type="button"
              onClick={() => setMobileNavOpen((value) => !value)}
              className="inline-flex items-center rounded-full border border-[rgba(19,19,30,0.08)] bg-white/80 px-4 py-2 lg:hidden"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.92rem',
                fontWeight: 500,
              }}
            >
              Navegación
            </button>
          </div>

          <a
            href="/"
            onClick={(event) => {
              event.preventDefault()
              navigate?.('/')
            }}
            className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--text-main)] px-5 text-white transition hover:opacity-90"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Volver al sitio
          </a>
        </div>
      </header>

      {mobileNavOpen && (
        <div className="section-shell relative z-30 pt-4 lg:hidden">
          <div className="rounded-[var(--radius-xl)] border border-[rgba(19,19,30,0.08)] bg-white/92 p-5 shadow-[0_18px_50px_rgba(15,17,21,0.08)] backdrop-blur-xl">
            <DocsSidebar
              currentDocPath={entry.docPath}
              navigate={navigate}
              mobile
              onNavigate={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      )}

      <main className="section-shell relative z-10 py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_220px]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-[var(--radius-2xl)] border border-[rgba(19,19,30,0.06)] bg-white/72 p-5 backdrop-blur-xl">
              <DocsSidebar currentDocPath={entry.docPath} navigate={navigate} />
            </div>
          </aside>

          <article className="min-w-0">
            <div className="rounded-[calc(var(--radius-2xl)+0.25rem)] border border-[rgba(19,19,30,0.06)] bg-white/82 px-6 py-8 shadow-[0_24px_80px_rgba(15,17,21,0.07)] backdrop-blur-xl sm:px-8 sm:py-10 lg:px-12">
              <p
                className="mb-6 uppercase"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  color: 'var(--text-muted)',
                }}
              >
                {entry.sectionTitle}
              </p>

              <MarkdownRenderer
                markdown={entry.content}
                currentDocPath={entry.docPath}
                navigate={navigate}
              />

              {(entry.previous || entry.next) && (
                <div className="mt-16 grid gap-4 border-t border-[rgba(19,19,30,0.08)] pt-6 sm:grid-cols-2">
                  {entry.previous ? (
                    <a
                      href={getRouteForDocPath(entry.previous.docPath)}
                      onClick={(event) => {
                        event.preventDefault()
                        navigate?.(getRouteForDocPath(entry.previous.docPath))
                      }}
                      className="rounded-[var(--radius-xl)] border border-[rgba(19,19,30,0.08)] bg-[rgba(19,19,30,0.02)] px-5 py-4 transition hover:bg-[rgba(19,19,30,0.04)]"
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                        }}
                      >
                        Anterior
                      </p>
                      <p
                        className="mt-2"
                        style={{
                          fontFamily: 'var(--font-ui)',
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--text-main)',
                        }}
                      >
                        {entry.previous.label}
                      </p>
                    </a>
                  ) : <div />}

                  {entry.next ? (
                    <a
                      href={getRouteForDocPath(entry.next.docPath)}
                      onClick={(event) => {
                        event.preventDefault()
                        navigate?.(getRouteForDocPath(entry.next.docPath))
                      }}
                      className="rounded-[var(--radius-xl)] border border-[rgba(19,19,30,0.08)] bg-[rgba(208,255,11,0.1)] px-5 py-4 text-left transition hover:bg-[rgba(208,255,11,0.16)]"
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                        }}
                      >
                        Siguiente
                      </p>
                      <p
                        className="mt-2"
                        style={{
                          fontFamily: 'var(--font-ui)',
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--text-main)',
                        }}
                      >
                        {entry.next.label}
                      </p>
                    </a>
                  ) : null}
                </div>
              )}
            </div>
          </article>

          <aside className="hidden xl:block">
            <div className="sticky top-24 rounded-[var(--radius-2xl)] border border-[rgba(19,19,30,0.06)] bg-white/72 p-5 backdrop-blur-xl">
              <p
                className="mb-4 uppercase"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  color: 'var(--text-muted)',
                }}
              >
                En esta página
              </p>

              <div className="space-y-1.5">
                {toc.length > 0 ? toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-soft)] transition hover:bg-[rgba(19,19,30,0.03)] hover:text-[var(--text-main)]"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.92rem',
                      fontWeight: 500,
                    }}
                  >
                    {item.text}
                  </a>
                )) : (
                  <p
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      color: 'var(--text-soft)',
                    }}
                  >
                    Esta página no tiene secciones secundarias.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
