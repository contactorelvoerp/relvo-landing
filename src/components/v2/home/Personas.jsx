import { useState } from 'react'
import { Container, SectionTag, Reveal } from '../primitives'
import { Aura, Grain } from '../Texture'

const roleColors = {
  founder: { text: '#D0FF0B', aura: '#B8D12A' },
  finance: { text: '#72DDAA', aura: '#186666' },
  revenue: { text: '#B9A5FF', aura: '#633BF2' },
}

/* Drop role photos into public/personas/{founder,finance,revenue}.jpg (vertical,
   person in an office, Taito-style). Until then the card falls back to a branded
   duotone panel. */
const photoSrc = {
  founder: '/personas/founder.jpg',
  finance: '/personas/finance.jpg',
  revenue: '/personas/revenue.jpg',
}

const PersonaCard = ({ card }) => {
  const [hasPhoto, setHasPhoto] = useState(true)
  const colors = roleColors[card.role]

  return (
    <div className="relative h-[420px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-default)] bg-ink sm:h-[460px]">
      {hasPhoto ? (
        <img
          src={photoSrc[card.role]}
          onError={() => setHasPhoto(false)}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <Aura color={colors.aura} size={480} opacity={0.5} blur={90} className="-right-24 -top-24" />
          <Aura color={colors.aura} size={320} opacity={0.25} blur={70} className="-bottom-16 -left-16" />
          <Grain opacity={0.08} />
        </>
      )}

      {/* Legibility gradient over the photo */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(19,19,30,0.92) 0%, rgba(19,19,30,0.45) 38%, rgba(19,19,30,0.08) 65%, transparent 100%)' }}
      />

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <span className="v2-eyebrow" style={{ color: colors.text }}>
          {card.label}
        </span>
        <p className="mt-2.5 font-sans text-[0.9375rem] leading-relaxed text-white/90">{card.body}</p>
      </div>
    </div>
  )
}

export const Personas = ({ t }) => (
  <section id="roles">
    <SectionTag accent="mint">{t.personas.eyebrow}</SectionTag>
    <Container className="py-16 sm:py-20 lg:py-24">
      <Reveal>
        <h2
          className="mx-auto max-w-3xl text-center font-sans font-medium tracking-[-0.02em] text-ink"
          style={{ fontSize: 'var(--text-h2)', lineHeight: 1.12 }}
        >
          {t.personas.title}
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-5 sm:mt-16 lg:grid-cols-3">
        {t.personas.cards.map((card, i) => (
          <Reveal key={card.role} delayMs={i * 90}>
            <PersonaCard card={card} />
          </Reveal>
        ))}
      </div>
    </Container>
  </section>
)
