import { Helmet } from 'react-helmet-async'
import { Nav } from '../../components/v2/Nav'
import { Footer } from '../../components/v2/Footer'
import { Container, Eyebrow, Card, Reveal, SectionHeader, SectionTag } from '../../components/v2/primitives'
import { Aura, Grain } from '../../components/v2/Texture'
import { ClosingCta } from '../../components/v2/home/ClosingCta'
import { paths, roleSlugs } from '../../i18n/copy'

const roleAccents = { founder: 'lime', finance: 'mint', revenue: 'purple' }
const roleAuraColor = { founder: '#D0FF0B', finance: '#72DDAA', revenue: '#633BF2' }

const Shell = ({ lang, t, navigate, pathname, title, description, children }) => (
  <div className="relative min-h-screen overflow-x-clip bg-white text-ink antialiased">
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
    <Nav lang={lang} t={t} navigate={navigate} pathname={pathname} />
    <main className="relative">
      {/* Boxed structure — vertical rails framing the content column */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-content -translate-x-1/2 border-x border-[var(--border-default)] lg:block"
      />
      {children}
    </main>
    <Footer lang={lang} t={t} navigate={navigate} pathname={pathname} />
  </div>
)

export const SolutionsIndexPage = ({ lang, t, navigate, pathname }) => {
  const p = paths[lang]
  const idx = t.solutions.index

  return (
    <Shell
      lang={lang}
      t={t}
      navigate={navigate}
      pathname={pathname}
      title={`${t.nav.solutions} | Relvo`}
      description={idx.body}
    >
      <section className="relative overflow-hidden pb-8 pt-36 sm:pt-44">
        <Aura color="#72DDAA" size={520} opacity={0.22} className="-top-32 right-[10%]" />
        <Grain opacity={0.03} />
        <Container className="relative">
          <Reveal>
            <SectionHeader eyebrow={idx.eyebrow} accent="mint" center title={idx.title} body={idx.body} />
          </Reveal>
        </Container>
      </section>

      <section className="pb-24 pt-10 sm:pb-32">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            {t.personas.cards.map((card, i) => {
              const href = p.solutionRole(roleSlugs[lang][card.role])
              return (
                <Reveal key={card.role} delayMs={i * 90}>
                  <Card
                    as="a"
                    href={href}
                    hover
                    className="group flex h-full cursor-pointer flex-col p-7 sm:p-8"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(href)
                    }}
                  >
                    <span className="v2-eyebrow" style={{ color: '#1B7A50' }}>
                      {card.label}
                    </span>
                    <p className="mt-4 flex-1 font-sans text-[1.0625rem] leading-relaxed text-ink">{card.body}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 font-sans text-[0.9375rem] font-medium text-ink-soft transition-colors group-hover:text-ink">
                      {card.cta}
                      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </Card>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      <ClosingCta t={t} />
    </Shell>
  )
}

export const SolutionRolePage = ({ lang, t, navigate, pathname, roleKey }) => {
  const role = t.solutions.roles[roleKey]
  const accent = roleAccents[roleKey]
  const features = role.featureIds.map((id) => t.features.find((f) => f.id === id)).filter(Boolean)
  const p = paths[lang]

  return (
    <Shell
      lang={lang}
      t={t}
      navigate={navigate}
      pathname={pathname}
      title={`${role.title} | Relvo`}
      description={role.body}
    >
      {/* Role hero */}
      <section className="relative overflow-hidden pb-16 pt-36 sm:pb-20 sm:pt-44">
        <Aura color={roleAuraColor[roleKey]} size={520} opacity={roleKey === 'founder' ? 0.16 : 0.2} className="-top-32 right-[6%]" />
        <Grain opacity={0.03} />
        <Container className="relative">
          <Reveal>
            <Eyebrow accent={accent}>{role.label}</Eyebrow>
            <h1
              className="mt-6 max-w-3xl font-sans font-medium tracking-[-0.02em] text-ink"
              style={{ fontSize: 'var(--text-h2)', lineHeight: 1.1 }}
            >
              {role.title}
            </h1>
            <p className="mt-6 max-w-[62ch] text-ink-soft" style={{ fontSize: 'var(--text-body-lg)', lineHeight: 1.55 }}>
              {role.body}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Pains */}
      <section>
        <SectionTag accent={accent}>{t.solutions.ctaLine}</SectionTag>
        <Container className="py-12 sm:py-16">
          <div className="grid gap-4 lg:grid-cols-3">
            {role.pains.map((pain, i) => (
              <Reveal key={pain} delayMs={i * 80}>
                <div className="h-full rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] bg-white px-5 py-5">
                  <p className="font-sans text-[0.9375rem] leading-relaxed text-ink-soft">{pain}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* What Relvo solves */}
      <section>
        <SectionTag accent={accent}>{t.solutions.featuresLabel}</SectionTag>
        <Container className="py-12 pb-24 sm:py-16 sm:pb-28">
          <div className="grid gap-5 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Reveal key={feature.id} delayMs={i * 90}>
                <Card
                  as="a"
                  href={`${p.home}#${feature.id}`}
                  hover
                  className="group flex h-full cursor-pointer flex-col p-7"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(p.home, feature.id)
                  }}
                >
                  <Eyebrow accent={accent}>{feature.eyebrow}</Eyebrow>
                  <h2 className="mt-4 font-sans text-[1.125rem] font-medium leading-snug tracking-[-0.01em] text-ink">
                    {feature.title}
                  </h2>
                  <p className="mt-3 flex-1 font-sans text-[0.9375rem] leading-relaxed text-ink-soft">{feature.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <ClosingCta t={t} />
    </Shell>
  )
}
