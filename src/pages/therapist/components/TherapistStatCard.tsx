import type { LucideIcon } from "lucide-react"

export function TherapistStatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: LucideIcon
  value: number | string
  label: string
  color: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
      <span className={`flex size-12 items-center justify-center rounded-xl ${color}`}>
        <Icon className="size-6" />
      </span>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  )
}
