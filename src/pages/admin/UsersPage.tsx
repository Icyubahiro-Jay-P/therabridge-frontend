import { useEffect, useState } from "react"
import {
  Loader2,
  Search,
  TriangleAlert,
  User as UserIcon,
  UserCog,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface AppUser {
  _id: string
  username: string
  firstName: string
  lastName: string
  email: string
  role: string
  avatar?: string | null
  createdAt?: string
}

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  therapist: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  user: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<AppUser[]>("/api/users/users")
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users")
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  // For now this is read-only; full role management would go here
  const filtered = users.filter((u) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">User management</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage all platform users.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by name, username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <TriangleAlert className="size-4 shrink-0" /> {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/60">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((u) => (
              <div
                key={u._id}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800">
                  <UserIcon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-xs text-gray-400">@{u.username} · {u.email}</p>
                </div>
                <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium", roleColors[u.role] ?? roleColors.user)}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <UserCog className="size-12 text-gray-300" />
              <p className="text-sm text-gray-400">No users match your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
