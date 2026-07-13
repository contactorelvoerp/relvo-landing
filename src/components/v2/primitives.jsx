export { Reveal } from '../landing/Reveal'

/* Accent tokens per section — single source for the rotating accent discipline */
export const ACCENTS = {
  lime: { solid: '#D0FF0B', tint: '#D5F7C1', text: '#13131E' },
  mint: { solid: '#72DDAA', tint: '#DFF4EB', text: '#13131E' },
  purple: { solid: '#633BF2', tint: '#E3C0F2', text: '#FFFFFF' },
  salmon: { solid: '#FF9566', tint: '#FFE3D4', text: '#13131E' },
}

export const Container = ({ children, className = '' }) => (
  <div className={`v2-container ${className}`.trim()}>{children}</div>
)

export const Section = ({ id, dark = false, className = '', padded = true, children, ...rest }) => (
  <section
    id={id}
    className={[
      'relative overflow-hidden',
      padded ? 'py-24 sm:py-32 lg:py-40' : '',
      dark ? 'bg-ink text-white' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {children}
  </section>
)

/* Bracketed mono eyebrow — `[ HOW IT WORKS ]` */
export const Eyebrow = ({ children, accent = 'purple', onDark = false, className = '' }) => {
  const color = onDark
    ? (accent === 'lime' ? '#D0FF0B' : accent === 'mint' ? '#72DDAA' : accent === 'salmon' ? '#FF9566' : '#B9A5FF')
    : (accent === 'purple' ? '#633BF2' : accent === 'salmon' ? '#C4501B' : accent === 'mint' ? '#1B7A50' : '#5F7500')
  return (
    <span className={`v2-eyebrow inline-flex items-baseline gap-2 ${className}`.trim()} style={{ color }}>
      <span aria-hidden="true">[</span>
      {children}
      <span aria-hidden="true">]</span>
    </span>
  )
}

const buttonBase =
  'inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-button)] px-7 font-sans text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2'

const buttonVariants = {
  primary:
    'bg-lime-brand text-ink hover:brightness-[1.06] hover:shadow-[0_6px_24px_rgba(208,255,11,0.45)] active:brightness-95',
  outline:
    'border border-[var(--border-strong)] bg-white/60 text-ink hover:border-ink/40 hover:bg-white',
  'outline-dark':
    'border border-white/25 bg-transparent text-white hover:border-white/60 hover:bg-white/5',
  ghost: 'text-ink hover:bg-ink/5',
}

export const Button = ({ as: Tag = 'a', variant = 'primary', className = '', children, ...rest }) => (
  <Tag className={`${buttonBase} ${buttonVariants[variant] ?? buttonVariants.primary} ${className}`.trim()} {...rest}>
    {children}
  </Tag>
)

export const Card = ({ as: Tag = 'div', className = '', hover = false, children, ...rest }) => (
  <Tag
    className={[
      'rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-white',
      hover
        ? 'transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[0_16px_40px_rgba(19,19,30,0.08)]'
        : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {children}
  </Tag>
)

/* Mono chip — `USAGE-BASED` */
export const Chip = ({ children, onDark = false, className = '' }) => (
  <span
    className={[
      'v2-eyebrow inline-flex items-center rounded-[var(--radius-sm)] px-4 py-2',
      onDark ? 'border border-white/20 text-white/85' : 'border border-[var(--border-strong)] text-ink-soft',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </span>
)

/* Full-width label strip that frames a section — the boxed structure (Autumn-style).
   Section differentiation comes from the tone of each big box, not from the strip. */
export const SectionTag = ({ children, accent = 'purple', dark = false, className = '' }) => {
  const line = dark ? 'border-white/10' : 'border-[var(--border-default)]'
  return (
    <div className={`border-y ${line} ${dark ? 'bg-white/[0.03]' : 'bg-[#F5F5F2]'} ${className}`.trim()}>
      <div className="v2-container py-3.5">
        <Eyebrow accent={accent} onDark={dark}>
          {children}
        </Eyebrow>
      </div>
    </div>
  )
}

/* Section heading group: eyebrow → H2 → optional body */
export const SectionHeader = ({
  eyebrow,
  accent = 'purple',
  title,
  body,
  onDark = false,
  center = false,
  className = '',
}) => (
  <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`.trim()}>
    {eyebrow && (
      <Eyebrow accent={accent} onDark={onDark}>
        {eyebrow}
      </Eyebrow>
    )}
    <h2
      className={`mt-5 font-sans font-medium tracking-[-0.02em] ${onDark ? 'text-white' : 'text-ink'}`}
      style={{ fontSize: 'var(--text-h2)', lineHeight: 1.12 }}
    >
      {title}
    </h2>
    {body && (
      <p
        className={`mt-6 ${onDark ? 'text-white/70' : 'text-ink-soft'}`}
        style={{ fontSize: 'var(--text-body-lg)', lineHeight: 1.55 }}
      >
        {body}
      </p>
    )}
  </div>
)
