import { Container, Reveal } from '../primitives'

const logos = [
  { id: 'tgp', src: '/logos/logo-tgp.png', alt: 'TGP' },
  { id: 'lidz', src: '/logos/logo-lidz.png', alt: 'Lidz' },
  { id: 'relif', src: '/logos/logo-relif.png', alt: 'Relif' },
  { id: 'bulk', src: '/logos/logo-bulk.png', alt: 'Bulk' },
]

export const SocialProof = ({ t }) => (
  <section className="border-t border-[var(--border-default)] bg-[#FBFBF9] py-8 sm:py-10" aria-labelledby="social-proof-label">
    <Container>
      <Reveal>
        <p id="social-proof-label" className="v2-eyebrow text-center text-muted-aa">
          {t.proof.label}
        </p>
        <div className="mx-auto mt-7 flex flex-wrap items-center justify-center gap-x-14 gap-y-6 sm:gap-x-20">
          {logos.map(({ id, src, alt }) => (
            <img
              key={id}
              src={src}
              alt={alt}
              loading="lazy"
              draggable={false}
              className="h-20 w-auto max-w-52 object-contain opacity-70 grayscale sm:h-28 sm:max-w-64"
            />
          ))}
        </div>
      </Reveal>
    </Container>
  </section>
)
