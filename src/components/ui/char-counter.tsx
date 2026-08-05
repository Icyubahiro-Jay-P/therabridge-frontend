import { cn } from "@/lib/utils"

interface CharCounterProps {
  count: number
  limit: number
  className?: string
}

export function CharCounter({ count, limit, className }: CharCounterProps) {
  const nearLimit = count >= limit * 0.8
  const overLimit = count > limit
  return (
    <span
      aria-live="polite"
      className={cn(
        "text-xs tabular-nums",
        overLimit
          ? "font-semibold text-red-600 dark:text-red-400"
          : nearLimit
            ? "text-amber-600 dark:text-amber-400"
            : "text-gray-400 dark:text-gray-500",
        className,
      )}
    >
      {count}/{limit}
    </span>
  )
}
