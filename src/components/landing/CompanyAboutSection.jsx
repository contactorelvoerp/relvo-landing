import { Reveal } from './Reveal'

const revenueFlow = [
  'Contratos',
  'Pricing',
  'Usage',
  'Aprobaciones',
  'Facturacion',
  'Cobranza',
  'Conciliacion',
  'Revenue',
]

const insightCards = [
  {
    eyebrow: 'Problema',
    title: 'Modelos comerciales flexibles, operaciones manuales.',
    body:
      'Las empresas B2B venden con contratos, descuentos y reglas cada vez mas dinamicas, pero siguen operando su revenue con planillas, correos y procesos desconectados.',
  },
  {
    eyebrow: 'Vision',
    title: 'Vender no deberia estar limitado por la operacion.',
    body:
      'Creemos que una empresa deberia poder vender con cualquier modelo comercial sin preocuparse de la complejidad de los cálculos que conlleva.',
  },
]

const teamMembers = [
  {
    name: 'Ricardo Cerda Waak',
    role: 'CEO y Cofundador',
    credential: 'Ingeniero Civil Industrial (UAI)',
    bio: 'Finanzas corporativas y de startups, cofundador de una firma de outsourcing contable.',
    imageSrc: '/team/ricardo.png',
    initials: 'RC',
  },
  {
    name: 'Augusto Tagle Montes',
    role: 'CTO y Cofundador',
    credential: 'Licenciado en Física (PUC)',
    bio: 'Magíster en Data Science y ML (Universidad de Chile) Software & Machine Learning Engineer.',
    imageSrc: '/team/augusto.png',
    initials: 'AT',
  },
  {
    name: 'Matías Billwiller Tagle',
    role: 'CPO y Cofundador',
    credential: 'Ingeniero Civil Industrial (PUC)',
    bio: 'Escalando producto y operaciones en startups de LATAM',
    imageSrc: '/team/matias.png',
    initials: 'MB',
  },
  {
    name: 'Malaquías Correa Anguita',
    role: 'Software Engineer',
    credential: 'Licenciado en Física (PUC)',
    bio: 'Doctor en Física (Universidad de Twente, Países Bajos) / Software Engineer & Quantum Optics.',
    imageSrc: '/team/malaquias.png',
    initials: 'MC',
  },
]

const TeamPhoto = ({ member }) => (
  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-[rgba(19,19,30,0.04)] sm:h-28 sm:w-28">
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.45rem',
        color: 'var(--text-soft)',
      }}
    >
      {member.initials}
    </div>
    <img
      src={member.imageSrc}
      alt={member.name}
      className="relative h-full w-full object-cover grayscale"
      onError={(event) => {
        event.currentTarget.style.display = 'none'
      }}
    />
  </div>
)

export const CompanyAboutSection = () => (
  <section id="about-us" className="px-4 py-24 sm:px-6 sm:py-32 md:py-40">
    <div className="section-shell">
      <Reveal className="grid gap-10 rounded-2xl bg-white/65 px-5 py-8 backdrop-blur-sm sm:px-8 sm:py-10 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:px-10 md:py-12 lg:gap-16 lg:px-12 lg:py-14"
        style={{
          border: '1px solid var(--border-default)',
          boxShadow: '0 18px 44px rgba(15, 17, 21, 0.05)',
        }}
      >
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="eyebrow-compact">Sobre Relvo</p>
            <h2
              className="mt-5 max-w-3xl"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4.4vw, 4.2rem)',
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                color: 'var(--text-main)',
              }}
            >
              Construimos la infraestructura de revenue para empresas B2B en LATAM
            </h2>
            <div
              className="mt-6 max-w-2xl space-y-4"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'clamp(1rem, 1.45vw, 1.25rem)',
                lineHeight: 1.55,
                color: 'var(--text-soft)',
              }}
            >
              <p>
                Relvo automatiza el flujo de ingresos, quote-to-cash, para empresas B2B con modelos comerciales complejos.
              </p>
              <p>
                Transformamos contratos, acuerdos comerciales, consumos, descuentos y reglas de pricing en facturacion, cobranza, conciliacion y revenue confiable.
              </p>
            </div>
          </div>

          <p
            className="max-w-2xl"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(1.05rem, 1.55vw, 1.35rem)',
              fontWeight: 500,
              lineHeight: 1.45,
              color: 'var(--text-main)',
            }}
          >
            Nuestra visión es convertirnos en la infraestructura de revenue para el B2B en LATAM.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {insightCards.map((card) => (
            <div
              key={card.eyebrow}
              className="rounded-2xl bg-white/75 p-5 sm:p-6"
              style={{
                border: '1px solid var(--border-default)',
                boxShadow: '0 10px 30px rgba(15, 17, 21, 0.04)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
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
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.45rem, 2.4vw, 2.1rem)',
                  fontWeight: 300,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-main)',
                }}
              >
                {card.title}
              </h3>
              <p
                className="mt-3"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'clamp(0.95rem, 1.25vw, 1.05rem)',
                  lineHeight: 1.55,
                  color: 'var(--text-soft)',
                }}
              >
                {card.body}
              </p>
            </div>
          ))}

          <div
            className="rounded-2xl bg-[var(--text-main)] p-5 text-white sm:p-6"
            style={{ boxShadow: '0 18px 44px rgba(19, 19, 30, 0.16)' }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.58)',
              }}
            >
              Flujo conectado
            </p>
            <p
              className="mt-3"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'clamp(0.95rem, 1.25vw, 1.05rem)',
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.82)',
              }}
            >
              Una capa financiera AI-native que modela pricing desde contratos, calcula montos a facturar, automatiza aprobaciones, emite facturas, gestiona cobranza y concilia pagos en un solo flujo.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {revenueFlow.map((item) => (
                <span
                  key={item}
                  className="inline-flex rounded-full px-3 py-2"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: item === 'Revenue' ? 'var(--brand-accent)' : 'rgba(255,255,255,0.07)',
                    color: item === 'Revenue' ? 'var(--text-main)' : 'rgba(255,255,255,0.86)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
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

      <Reveal
        className="mt-10 rounded-2xl bg-white/65 px-5 py-8 backdrop-blur-sm sm:mt-12 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-12 lg:py-14"
        style={{
          border: '1px solid var(--border-default)',
          boxShadow: '0 18px 44px rgba(15, 17, 21, 0.05)',
        }}
      >
        <div className="grid gap-8 md:grid-cols-[0.82fr_1.18fr] md:items-start">
          <div>
            <p className="eyebrow-compact">Quiénes somos</p>
            <h2
              className="mt-5 max-w-xl"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.9rem, 3.6vw, 3.4rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: 'var(--text-main)',
              }}
            >
              Vivimos el problema desde distintas perspectivas; finanzas, operaciones, tecnología y procurement.
            </h2>
            <p
              className="mt-5 max-w-xl"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'clamp(1rem, 1.35vw, 1.15rem)',
                lineHeight: 1.55,
                color: 'var(--text-soft)',
              }}
            >
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="flex gap-4 rounded-2xl bg-white/75 p-4 sm:flex-col sm:p-5"
                style={{
                  border: '1px solid var(--border-default)',
                  boxShadow: '0 10px 30px rgba(15, 17, 21, 0.04)',
                }}
              >
                <TeamPhoto member={member} />
                <div className="min-w-0">
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.15rem, 1.8vw, 1.55rem)',
                      fontWeight: 300,
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em',
                      color: 'var(--text-main)',
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="mt-2"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      lineHeight: 1.25,
                      color: 'var(--text-main)',
                    }}
                  >
                    {member.role}
                  </p>
                  <p
                    className="mt-1"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      lineHeight: 1.35,
                      color: '#176d6f',
                    }}
                  >
                    {member.credential}
                  </p>
                  <p
                    className="mt-2"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.9rem',
                      lineHeight: 1.45,
                      color: 'var(--text-soft)',
                    }}
                  >
                    {member.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
)
