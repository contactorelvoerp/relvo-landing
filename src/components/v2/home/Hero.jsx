import { Container, Eyebrow, Button, Reveal } from '../primitives'
import { Aura, Grain } from '../Texture'
import { HeroVisual } from './HeroVisual'
import { trackScheduleDemo } from '../../../utils/analytics'

const calendlyHref = 'https://calendar.app.google/GbBM26VivFQHGzyL9'

export const Hero = ({ t, lang }) => {
  const handleStart = (event) => {
    event.preventDefault()
    trackScheduleDemo('hero')
    document.getElementById('start')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40 lg:pt-44">
      {/* Soft brand auras + grain */}
      <Aura color="#72DDAA" size={620} opacity={0.3} className="-top-40 right-[8%]" />
      <Aura color="#D0FF0B" size={480} opacity={0.22} className="top-32 right-[-6%]" />
      <Grain opacity={0.04} />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          {/* Copy */}
          <div>
            <Reveal>
              <Eyebrow accent="lime">{t.hero.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delayMs={80}>
              <h1
                className="mt-6 max-w-[16ch] font-display font-medium text-ink"
                style={{ fontSize: 'clamp(2.375rem, 1.85rem + 2.4vw, 3.625rem)', lineHeight: 1.05, letterSpacing: '-0.015em' }}
              >
                {t.hero.title}
              </h1>
            </Reveal>
            <Reveal delayMs={160}>
              <p
                className="mt-6 max-w-[52ch] text-ink-soft"
                style={{ fontSize: 'var(--text-body)', lineHeight: 1.6 }}
              >
                {t.hero.subhead}
              </p>
            </Reveal>
            <Reveal delayMs={240}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button variant="primary" href="#start" onClick={handleStart}>
                  {t.hero.ctaPrimary}
                </Button>
                <Button
                  variant="outline"
                  href={calendlyHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackScheduleDemo('hero_secondary')}
                >
                  {t.hero.ctaSecondary}
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Product sketch — contract → cash, live */}
          <Reveal delayMs={200}>
            <HeroVisual lang={lang} />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
