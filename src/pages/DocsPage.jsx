import { useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Menu, ArrowLeft, ArrowRight } from 'lucide-react'
import { MarkdownRenderer } from '../components/docs/MarkdownRenderer'
import { Navbar } from '../components/landing/Navbar'
import { FooterSection } from '../components/landing/FooterSection'
import {
  docsNavigation,
  getDocEntry,
  getRouteForDocPath,
  getTableOfContents,
} from '../docs/docsContent'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const SidebarItem = ({ item, currentDocPath, navigate, onNavigate, level = 0 }) => {
  const href = getRouteForDocPath(item.docPath)
  const isActive = item.docPath === currentDocPath
  const childActive = (item.children ?? []).some((child) => child.docPath === currentDocPath)
  const active = isActive || childActive

  return (
    <div>
      <a
        href={href}
        onClick={(event) => {
          event.preventDefault()
          onNavigate?.()
          navigate?.(href)
        }}
        className={[
          'flex items-center py-1.5 pr-2 text-[0.875rem] transition-colors duration-150 cursor-pointer',
          level > 0 ? 'pl-3' : 'pl-0',
          active
            ? 'font-semibold text-[var(--text-main)]'
            : 'font-normal text-[var(--text-soft)] hover:text-[var(--text-main)]',
        ].join(' ')}
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {item.label}
      </a>

      {item.children?.length ? (
        <div className="mt-0.5 space-y-0.5 pl-3 border-l border-[var(--border-subtle)]">
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

const DocsSidebar = ({ currentDocPath, navigate, onNavigate }) => (
  <nav className="space-y-7">
    {docsNavigation.map((section) => (
      <div key={section.title}>
        <p
          className="mb-2.5 uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.63rem',
            fontWeight: 600,
            letterSpacing: '0.16em',
            color: 'var(--text-muted)',
          }}
        >
          {section.title}
        </p>
        <Separator className="mb-3 bg-[var(--border-subtle)]" />
        <div className="space-y-0.5">
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

export const DocsPage = ({ pathname, navigate, t }) => {
  const entry = useMemo(() => getDocEntry(pathname), [pathname])
  const toc = useMemo(() => getTableOfContents(entry.content), [entry.content])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [entry.docPath])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fcfcf8] text-[var(--text-main)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at top left, rgba(208,255,11,0.14), transparent 28%), radial-gradient(circle at top right, rgba(255,149,102,0.18), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.98))' }} />
      <Helmet>
        <title>{entry.title} | Relvo Docs</title>
        <meta
          name="description"
          content="Documentación de usuario final de Relvo para equipos de operaciones comerciales, revenue ops y finanzas."
        />
      </Helmet>

      <Navbar t={t} navigate={navigate} activePath="/docs" forceBackdrop />

      {/* Mobile nav */}
      <div className="section-shell relative z-30 flex items-center gap-3 pt-20 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-[var(--border-default)] bg-white px-3 py-2 text-[0.875rem] text-[var(--text-soft)] transition-colors hover:text-[var(--text-main)] cursor-pointer"
              style={{ fontFamily: 'var(--font-ui)', fontWeight: 500 }}
            >
              <Menu size={15} strokeWidth={1.8} />
              Navegación
            </button>
          </SheetTrigger>
          <SheetContent side="left" showCloseButton={false} className="w-72 p-0 bg-white border-r border-[var(--border-subtle)]">
            <ScrollArea className="h-full px-6 pt-14 pb-8">
              <DocsSidebar
                currentDocPath={entry.docPath}
                navigate={navigate}
              />
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <span
          className="uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.63rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            color: 'var(--text-muted)',
          }}
        >
          {entry.sectionTitle}
        </span>
      </div>

      <main className="section-shell relative z-10 py-10 lg:pt-28">
        <div className="grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_190px]">

          {/* Left sidebar */}
          <aside className="hidden lg:block self-start sticky top-24">
            <ScrollArea className="max-h-[calc(100vh-7rem)] pr-2">
              <DocsSidebar currentDocPath={entry.docPath} navigate={navigate} />
            </ScrollArea>
          </aside>

          {/* Main content */}
          <article className="min-w-0 max-w-2xl">
            <p
              className="mb-7 uppercase"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.63rem',
                fontWeight: 600,
                letterSpacing: '0.16em',
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
              <div className="mt-16 grid gap-3 border-t border-[var(--border-subtle)] pt-8 sm:grid-cols-2">
                {entry.previous ? (
                  <a
                    href={getRouteForDocPath(entry.previous.docPath)}
                    onClick={(event) => {
                      event.preventDefault()
                      navigate?.(getRouteForDocPath(entry.previous.docPath))
                    }}
                    className="group flex flex-col gap-1.5 rounded-lg border border-[var(--border-default)] px-5 py-4 transition-colors hover:border-[var(--border-strong)] hover:bg-[rgba(19,19,30,0.02)] cursor-pointer"
                  >
                    <span
                      className="flex items-center gap-1.5 uppercase"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6rem',
                        letterSpacing: '0.14em',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <ArrowLeft size={10} />
                      Anterior
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                      }}
                    >
                      {entry.previous.label}
                    </span>
                  </a>
                ) : <div />}

                {entry.next ? (
                  <a
                    href={getRouteForDocPath(entry.next.docPath)}
                    onClick={(event) => {
                      event.preventDefault()
                      navigate?.(getRouteForDocPath(entry.next.docPath))
                    }}
                    className="group flex flex-col gap-1.5 rounded-lg border border-[var(--border-default)] bg-[rgba(208,255,11,0.06)] px-5 py-4 text-left transition-colors hover:bg-[rgba(208,255,11,0.12)] cursor-pointer"
                  >
                    <span
                      className="flex items-center justify-end gap-1.5 uppercase"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6rem',
                        letterSpacing: '0.14em',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Siguiente
                      <ArrowRight size={10} />
                    </span>
                    <span
                      className="text-right"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                      }}
                    >
                      {entry.next.label}
                    </span>
                  </a>
                ) : null}
              </div>
            )}
          </article>

          {/* Right TOC */}
          <aside className="hidden xl:block">
            <div className="sticky top-24 border-l border-[var(--border-subtle)] pl-5">
              <p
                className="mb-4 uppercase"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
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
                    className="block text-[0.825rem] text-[var(--text-soft)] transition-colors hover:text-[var(--text-main)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {item.text}
                  </a>
                )) : (
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.825rem',
                      color: 'var(--text-soft)',
                    }}
                  >
                    —
                  </span>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <FooterSection t={t} navigate={navigate} />
    </div>
  )
}
