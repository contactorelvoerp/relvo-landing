export function InfoTooltip({ content }) {
  return (
    <span className="group/tip relative ml-1.5 inline-flex align-middle">
      <span
        className="inline-flex h-[1em] w-[1em] cursor-help select-none items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--text-muted)]"
        style={{ fontSize: '0.72em', lineHeight: 1 }}
      >
        ?
      </span>
      <span
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg bg-[var(--text-main)] px-3 py-2 text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tip:opacity-100"
        style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', lineHeight: 1.5 }}
      >
        {content}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[var(--text-main)]" />
      </span>
    </span>
  )
}
