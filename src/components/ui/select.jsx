import { cn } from "@/lib/utils"

function SelectField({ className, children, ...props }) {
  return (
    <select
      data-slot="select-field"
      className={cn(
        "w-full rounded-md border px-3 py-2.5 text-[1rem] text-[var(--text-main)] outline-none transition-colors bg-white",
        "border-[var(--border-default)] hover:border-[var(--border-strong)]",
        "focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{ fontFamily: 'var(--font-ui)' }}
      {...props}
    >
      {children}
    </select>
  )
}

export { SelectField }
