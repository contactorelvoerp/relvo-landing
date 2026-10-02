export function NotFoundPage({ t }) {
  return (
    <section className="not-found">
      <h1 className="not-found__title">{t.notFound.title}</h1>
      <a className="btn btn--secondary btn--md" href="/">{t.notFound.home}</a>
    </section>
  )
}
