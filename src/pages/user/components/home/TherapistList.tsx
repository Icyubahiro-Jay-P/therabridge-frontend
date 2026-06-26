import { CalendarDays, Puzzle, Sparkles } from "lucide-react"

import type { User } from "@/types/user"

interface TherapistListProps {
  user: User
}

export function TherapistList({ user }: TherapistListProps) {
  const items = [
    {
      label: "Member since",
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })
        : "Today",
      Icon: CalendarDays,
    },
    {
      label: "Account role",
      value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
      Icon: Puzzle,
    },
    {
      label: "Username",
      value: `@${user.username}`,
      Icon: Sparkles,
    },
  ] as const

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {items.map(({ label, value, Icon }) => (
        <div
          key={label}
          className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700/60 dark:bg-gray-900"
        >
          <Icon className="size-7 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
            <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
