import { CalendarDays, Mail, Shield } from "lucide-react"
import type { User } from "@/types/user"

interface Props {
  user: User
}

export function AccountOverview({ user }: Props) {
  const items = [
    { icon: Mail, label: "Email", value: user.email },
    {
      icon: Shield,
      label: "Role",
      value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    },
    {
      icon: CalendarDays,
      label: "Member since",
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })
        : "Today",
    },
  ] as const

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-900"
        >
          <Icon className="size-5 shrink-0 text-gray-400" />
          <div className="min-w-0">
            <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
