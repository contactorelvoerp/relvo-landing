import { Container, SectionHeader, Chip, Reveal } from '../primitives'
import { Aura, Grain } from '../Texture'

export const UsageAI = ({ t }) => (
  <section id="usage" className="py-14 sm:py-20">
    <Container>
      <Reveal>
        <div className="glass-block px-6 py-16 text-center sm:px-12 sm:py-20 lg:py-24">
          {/* Layered purple auras + grain, contained inside the block */}
          <Aura color="#633BF2" size={720} opacity={0.45} blur={110} className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          <Aura color="#3F28B2" size={480} opacity={0.5} blur={90} className="right-[4%] top-[-20%]" />
          <Aura color="#E3C0F2" size={340} opacity={0.15} blur={80} className="bottom-[-25%] left-[8%]" />
          <Grain opacity={0.07} />

          <div className="relative mx-auto max-w-3xl">
            <SectionHeader
              eyebrow={t.usage.eyebrow}
              accent="purple"
              onDark
              center
              title={t.usage.title}
              body={t.usage.body}
            />
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {t.usage.chips.map((chip) => (
                <Chip key={chip} onDark className="glass-chip">
                  {chip}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Container>
  </section>
)
