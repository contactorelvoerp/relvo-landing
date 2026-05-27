import { cn } from "@/lib/utils"

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full rounded-md border px-3 py-2.5 text-[1rem] text-[var(--text-main)] outline-none transition-colors",
        "border-[var(--border-default)] bg-white",
        "hover:border-[var(--border-strong)]",
        "focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-1",
        "placeholder:text-[var(--text-muted)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{ fontFamily: 'var(--font-ui)' }}
      {...props}
    />
  )
}

export { Textarea }
