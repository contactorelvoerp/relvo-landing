import { Reveal } from './Reveal'

const revenueFlow = [
  'Contratos',
  'Pricing',
  'Usage',
  'Aprobaciones',
  'Facturación',
  'Cobranza',
  'Conciliación',
  'Revenue',
]

const insightCards = [
  {
    eyebrow: 'Problema',
    title: 'Modelos comerciales flexibles, operaciones manuales.',
    body: 'Las empresas B2B venden con contratos, descuentos y reglas cada vez más dinámicas, pero siguen operando su revenue con planillas, correos y procesos desconectados.',
  },
  {
    eyebrow: 'Visión',
    title: 'Vender no debería estar limitado por la operación.',
    body: 'Creemos que una empresa debería poder vender con cualquier modelo comercial sin preocuparse de la complejidad de los cálculos que conlleva.',
  },
]

const teamMembers = [
  {
    name: 'Ricardo Cerda Waak',
    role: 'CEO y Cofundador',
    credential: 'Ing. Civil Industrial · UAI',
    bio: 'Finanzas corporativas y de startups, cofundador de una firma de outsourcing contable.',
    imageSrc: '/team/ricardo.png',
    initials: 'RC',
  },
  {
    name: 'Augusto Tagle Montes',
    role: 'CTO y Cofundador',
    credential: 'Lic. en Física · PUC',
    bio: 'Magíster en Data Science y ML · Software & Machine Learning Engineer.',
    imageSrc: '/team/augusto.png',
    initials: 'AT',
  },
  {
    name: 'Matías Billwiller Tagle',
    role: 'CPO y Cofundador',
    credential: 'Ing. Civil Industrial · PUC',
    bio: 'Escalando producto y operaciones en startups de LATAM.',
    imageSrc: '/team/matias.png',
    initials: 'MB',
  },
  {
    name: 'Malaquías Correa Anguita',
    role: 'Software Engineer',
    credential: 'Dr. en Física · U. de Twente',
    bio: 'Software Engineer & Quantum Optics.',
    imageSrc: '/team/malaquias.png',
    initials: 'MC',
  },
]

const TeamPhoto = ({ member }) => (
  <div className="relative w-full overflow-hidden rounded-lg bg-[rgba(19,19,30,0.04)]" style={{ aspectRatio: '4/3' }}>
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ fontFamily: 'var(--font-ui)', fontSize: '2.5rem', color: 'var(--text-soft)' }}
    >
      {member.initials}
    </div>
    <img
      src={member.imageSrc}
      alt={member.name}
      className="relative h-full w-full object-cover object-top grayscale"
      onError={(e) => { e.currentTarget.style.display = 'none' }}
    />
  </div>
)

export const CompanyAboutSection = () => (
  <section id="about-us" className="px-4 pb-24 pt-36 sm:px-6 sm:pb-32 sm:pt-44 md:pb-40">
    <div className="section-shell space-y-10 sm:space-y-12">

      {/* ── Bloque principal ── */}
      <Reveal className="px-2 sm:px-4">
        {/* Eyebrow */}
        <p
          className="mb-3 text-center uppercase"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.16em', color: 'var(--text-muted)' }}
        >
          Nosotros
        </p>
        <h2
          className="mx-auto max-w-3xl text-center"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--text-main)',
          }}
        >
          Construimos la infraestructura de revenue para empresas B2B en LATAM
        </h2>

        {/* Subtítulo */}
        <p
          className="mx-auto mt-5 max-w-2xl text-center"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '1rem',
            lineHeight: 1.65,
            color: 'var(--text-soft)',
          }}
        >
          Relvo automatiza el flujo quote-to-cash para empresas B2B con modelos comerciales complejos.
          Transformamos contratos, acuerdos, consumos y reglas de pricing en facturación, cobranza, conciliación y revenue confiable.
        </p>

        {/* Tarjetas */}
        <div className="mt-16 grid gap-4 sm:grid-cols-3 sm:mt-20">
          {insightCards.map((card) => (
            <div
              key={card.eyebrow}
              className="rounded-md bg-white/75 p-5"
              style={{ border: '1px solid var(--border-default)', boxShadow: '0 10px 30px rgba(15,17,21,0.04)' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                {card.eyebrow}
              </p>
              <h3
                className="mt-3"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                  fontWeight: 300,
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-main)',
                }}
              >
                {card.title}
              </h3>
              <p
                className="mt-2"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  color: 'var(--text-soft)',
                }}
              >
                {card.body}
              </p>
            </div>
          ))}

          {/* Flujo conectado */}
          <div
            className="rounded-md bg-[var(--text-main)] p-5"
            style={{ boxShadow: '0 18px 44px rgba(19,19,30,0.16)' }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Flujo conectado
            </p>
            <p
              className="mt-3"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              Una capa financiera AI-native que modela pricing desde contratos, calcula montos a facturar, automatiza aprobaciones, emite facturas, gestiona cobranza y concilia pagos en un solo flujo.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {revenueFlow.map((item) => (
                <span
                  key={item}
                  className="inline-flex rounded-full px-2.5 py-1"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: item === 'Revenue' ? 'var(--brand-accent)' : 'rgba(255,255,255,0.07)',
                    color: item === 'Revenue' ? 'var(--text-main)' : 'rgba(255,255,255,0.82)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Equipo ── */}
      <Reveal
        className="rounded-lg bg-white/65 px-5 py-8 backdrop-blur-sm sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-12 lg:py-14"
        style={{ border: '1px solid var(--border-default)', boxShadow: '0 18px 44px rgba(15,17,21,0.05)' }}
      >
        {/* Eyebrow + Título */}
        <p className="eyebrow-compact text-center">Quiénes somos</p>
        <h2
          className="mx-auto mt-4 max-w-xl text-center"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--text-main)',
          }}
        >
          Vivimos el problema desde adentro.
        </h2>

        {/* Subtítulo */}
        <p
          className="mx-auto mt-5 max-w-2xl text-center"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '1rem',
            lineHeight: 1.65,
            color: 'var(--text-soft)',
          }}
        >
          Finanzas, operaciones, tecnología y producto — cada uno llegó a Relvo habiendo visto el caos del revenue B2B desde su propio ángulo.
        </p>

        {/* Tarjetas equipo */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden rounded-md bg-white/75"
              style={{ border: '1px solid var(--border-default)', boxShadow: '0 10px 30px rgba(15,17,21,0.04)' }}
            >
              <TeamPhoto member={member} />
              <div className="p-5">
                <h3
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '1rem',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    color: 'var(--text-main)',
                  }}
                >
                  {member.name}
                </h3>
                <p
                  className="mt-1.5"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--text-soft)',
                  }}
                >
                  {member.role}
                </p>
                <p
                  className="mt-3"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    color: 'var(--text-soft)',
                  }}
                >
                  {member.credential}
                </p>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    color: 'var(--text-muted)',
                  }}
                >
                  {member.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

    </div>
  </section>
)
