import React from 'react'

const variants = {
  primary: `
    bg-[var(--text-main)] text-white
    hover:opacity-90
  `,
  secondary: `
    bg-white text-[var(--text-main)]
    border border-black/[0.08]
    hover:bg-[var(--surface-subtle)]
  `,
  ghost: `
    text-[var(--text-main)]
    hover:bg-black/[0.04]
  `,
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export const ButtonLink = ({
  href = '#',
  children,
  variant = 'primary',
  external = false,
  className = '',
  ...props
}) => {
  const rel = external ? 'noopener noreferrer' : undefined
  const target = external ? '_blank' : undefined

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={cx(
        `
          inline-flex items-center justify-center
          rounded-[var(--radius-button)]
          px-5 py-2.5
          text-sm font-medium
          transition-all duration-200
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--focus-ring)]
          focus-visible:ring-offset-2
        `,
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}