export const ButtonLink = ({
  href,
  children,
  variant = 'primary',
  external = false,
  className = '',
}) => {
  const baseClassName =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold tracking-[-0.01em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2'

  const variants = {
    primary:
      'bg-[var(--text-main)] text-white shadow-[0_18px_40px_rgba(16,16,14,0.16)] hover:-translate-y-0.5 hover:bg-black',
    secondary:
      'border border-black/10 bg-white/70 text-[var(--text-main)] hover:border-black/20 hover:bg-white',
    dark:
      'border border-white/[0.15] bg-white text-[var(--text-main)] hover:bg-white/90',
  }

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={[baseClassName, variants[variant], className].join(' ')}
    >
      {children}
    </a>
  )
}
