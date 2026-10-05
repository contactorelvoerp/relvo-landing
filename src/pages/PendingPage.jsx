// Placeholder interno: solo existe en previews y en local, nunca en producción.
export function PendingPage({ route }) {
  return (
    <section className="pending">
      <p className="pending__tag">[PENDIENTE]</p>
      <h1 className="pending__title">{route.title}</h1>
      <p className="pending__note">
        Página sin implementar. Se ve solo en previews y no se publica en producción.
      </p>
    </section>
  )
}
