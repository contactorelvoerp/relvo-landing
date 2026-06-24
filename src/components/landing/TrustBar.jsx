const logos = [
  { id: 'tgp',      src: '/logos/logo-tgp.png',      alt: 'TGP'      },
  { id: 'relif',    src: '/logos/logo-relif.png',     alt: 'Relif'    },
  { id: 'lidz',     src: '/logos/logo-lidz.png',      alt: 'LIDZ.ai'  },
  { id: 'bulk',     src: '/logos/logo-bulk.png',      alt: 'Bulk'     },
]

export const TrustBar = () => (
  <section className="px-4 pb-4 pt-10 sm:px-6 sm:pb-6 sm:pt-12" aria-labelledby="customer-logos-title">
    <p
      id="customer-logos-title"
      className="mb-6 text-center sm:mb-8"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(0.68rem, 0.9vw, 0.78rem)',
        fontWeight: 400,
        color: 'var(--text-muted)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}
    >
      Empresas que ya automatizan sus ingresos con Relvo
    </p>

    <div className="mx-auto grid max-w-5xl grid-cols-2 items-center justify-items-center gap-x-8 gap-y-6 sm:grid-cols-4 sm:gap-x-14">
      {logos.map(({ id, src, alt }) => (
        <div key={id} className="flex h-28 w-full max-w-72 items-center justify-center sm:h-32 sm:max-w-80">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="max-h-24 w-full object-contain sm:max-h-28"
            style={{ filter: 'grayscale(1)', opacity: 0.78 }}
            draggable={false}
          />
        </div>
      ))}
    </div>
  </section>
)
