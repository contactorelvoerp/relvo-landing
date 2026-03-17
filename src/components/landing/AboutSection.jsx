export const AboutSection = ({ t }) => {
  return (
    <section className="section-shell bg-white py-14">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-black/[0.06] bg-[var(--surface-subtle)] px-8 py-14 text-center shadow-[0_20px_50px_rgba(16,16,14,0.05)] sm:px-14">
          <h2 className="font-display text-3xl tracking-[-0.04em] text-[var(--text-main)]">
            {t.aboutTitle}
          </h2>

          <p className="mt-6 text-lg leading-8 text-[var(--text-muted)]">
            {t.aboutP1}
          </p>
        </div>
      </div>
    </section>
  )
}