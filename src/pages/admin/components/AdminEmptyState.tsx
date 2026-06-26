import type { LucideIcon } from "lucide-react"

export function AdminEmptyState({
  icon: Icon,
  message,
}: {
  icon: LucideIcon
  message: string
}) {
  return (
    <div className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
      <Icon className="size-12 text-gray-300" />
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  )
}
