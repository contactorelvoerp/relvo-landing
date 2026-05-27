const logos = [
  { id: 'w',        src: '/logos/logo-w.png',        alt: 'W'        },
  { id: 'tgp',      src: '/logos/logo-tgp.png',      alt: 'TGP'      },
  { id: 'relif',    src: '/logos/logo-relif.png',     alt: 'Relif'    },
  { id: 'lidz',     src: '/logos/logo-lidz.png',      alt: 'LIDZ.ai'  },
  { id: 'sintopix', src: '/logos/logo-sintropix.png', alt: 'Sintopix' },
]

export const TrustBar = () => (
  <div className="px-4 py-10 sm:py-14">
    <p
      className="mb-10 text-center sm:mb-12"
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.8rem',
        fontWeight: 400,
        color: 'var(--text-muted)',
      }}
    >
      Empresas que ya automatizan sus ingresos con nosotros
    </p>

    <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16">
      {logos.map(({ id, src, alt }) => (
        <div key={id} className="flex w-36 items-center justify-center sm:w-40">
          <img
            src={src}
            alt={alt}
            className="max-h-14 w-full object-contain sm:max-h-16"
            style={{ filter: 'grayscale(1)', opacity: 0.75 }}
            draggable={false}
          />
        </div>
      ))}
    </div>
  </div>
)
