import type { LucideIcon } from "lucide-react"

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
        <Icon className="size-10 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="max-w-xs text-sm text-gray-400">
        {description}
      </p>
    </div>
  )
}
