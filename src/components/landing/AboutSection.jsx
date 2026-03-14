export const AboutSection = ({ t }) => {
  return (
    <section className="section-shell border-t border-black/[0.06] bg-[var(--surface-subtle)] py-14">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl tracking-[-0.04em] text-[var(--text-main)]">
          {t.aboutTitle}
        </h2>

        <p className="mt-6 text-lg leading-8 text-[var(--text-muted)]">
          {t.aboutP1}
        </p>

      </div>
    </section>
  )
}