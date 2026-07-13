import { Container, Eyebrow, SectionTag, Reveal } from '../primitives'
import {
  Scene,
  ContractsVisual,
  ApprovalsVisual,
  InvoicingVisual,
  CollectionVisual,
  ARVisual,
} from './FeatureVisuals'

const visualByFeature = {
  contracts: { Visual: ContractsVisual, accent: 'lime' },
  approvals: { Visual: ApprovalsVisual, accent: 'mint' },
  invoicing: { Visual: InvoicingVisual, accent: 'salmon' },
  collection: { Visual: CollectionVisual, accent: 'purple' },
  ar: { Visual: ARVisual, accent: 'lime' },
}

export const Features = ({ t, lang }) => (
  <section id="producto" className="bg-[#FBFBF9]">
    <SectionTag accent="lime">{t.nav.product}</SectionTag>

    {/* Each feature lives in its own box, separated by full-width hairlines */}
    {t.features.map((feature, index) => {
      const { Visual, accent } = visualByFeature[feature.id]
      const flip = index % 2 === 1
      return (
        <div
          key={feature.id}
          id={feature.id}
          className={`scroll-mt-16 ${index > 0 ? 'border-t border-[var(--border-default)]' : ''}`}
        >
          <Container className="py-16 sm:py-20 lg:py-24">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className={flip ? 'lg:order-2' : ''}>
                <Eyebrow accent={accent}>{feature.eyebrow}</Eyebrow>
                <h3
                  className="mt-5 max-w-md font-sans font-medium tracking-[-0.015em] text-ink"
                  style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1.4vw, 2.125rem)', lineHeight: 1.18 }}
                >
                  {feature.title}
                </h3>
                <p className="mt-5 max-w-lg text-ink-soft" style={{ fontSize: 'var(--text-body-lg)', lineHeight: 1.55 }}>
                  {feature.body}
                </p>
              </Reveal>
              <Reveal delayMs={120} className={flip ? 'lg:order-1' : ''}>
                <Scene accent={accent}>
                  <Visual lang={lang} />
                </Scene>
              </Reveal>
            </div>
          </Container>
        </div>
      )
    })}
  </section>
)
