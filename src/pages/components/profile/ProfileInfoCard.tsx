import type { LucideIcon } from "lucide-react"

export function ProfileInfoCard({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: LucideIcon
  label: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
      <Icon className="size-5 shrink-0 text-gray-400" />
      <div className="min-w-0">
        <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
        {children ?? (value ? (
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{value}</p>
        ) : null)}
      </div>
    </div>
  )
}
