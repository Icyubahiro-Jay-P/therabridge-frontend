import { useEffect, useState } from "react"
import {
  Ban,
  CheckCircle2,
  Loader2,
  Search,
  ShieldOff,
  Trash2,
  TriangleAlert,
  User as UserIcon,
  UserCog,
} from "lucide-react"

import { Button } from "@/components/ui/button"
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
  isDisabled?: boolean
}

// const roleColors: Record<string, string> = {
//   admin: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
//   therapist: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
//   user: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
// }

export function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

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

  async function toggleDisable(id: string) {
    setActionLoading(id)
    setError(null)
    setSuccess(null)
    try {
      const { data } = await api.put(`/api/users/admin/disable/${id}`)
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isDisabled: data.user.isDisabled } : u))
      setSuccess(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed")
    } finally {
      setActionLoading(null)
    }
  }

  async function changeRole(id: string, role: string) {
    setActionLoading(id)
    setError(null)
    setSuccess(null)
    try {
      const { data } = await api.put(`/api/users/admin/role/${id}`, { role })
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role: data.user.role } : u))
      setSuccess(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed")
    } finally {
      setActionLoading(null)
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return
    setActionLoading(id)
    setError(null)
    setSuccess(null)
    try {
      await api.delete(`/api/users/admin/user/${id}`)
      setUsers((prev) => prev.filter((u) => u._id !== id))
      setSuccess("User deleted.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed")
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">User management</h1>
        <p className="mt-2 text-muted-foreground">
          Manage all platform users — change roles, disable accounts, or remove users.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="size-4 shrink-0" /> {success}
        </div>
      )}

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
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/60">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((u) => (
              <div
                key={u._id}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50",
                  u.isDisabled && "opacity-50"
                )}
              >
                <div className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full",
                  u.isDisabled ? "bg-gray-200 text-gray-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                )}>
                  <UserIcon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {u.firstName} {u.lastName}
                    {u.isDisabled && <span className="ml-2 text-xs text-red-500">(Disabled)</span>}
                  </p>
                  <p className="text-xs text-gray-400">@{u.username} · {u.email}</p>
                </div>

                <select
                  value={u.role}
                  onChange={(e) => changeRole(u._id, e.target.value)}
                  disabled={actionLoading === u._id}
                  className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:border-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="user">User</option>
                  <option value="therapist">Therapist</option>
                  <option value="admin">Admin</option>
                </select>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => toggleDisable(u._id)}
                    disabled={actionLoading === u._id}
                    className={cn(
                      "text-xs",
                      u.isDisabled ? "text-emerald-500 hover:bg-emerald-50" : "text-amber-500 hover:bg-amber-50"
                    )}
                    title={u.isDisabled ? "Enable account" : "Disable account"}
                  >
                    {actionLoading === u._id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : u.isDisabled ? (
                      <ShieldOff className="size-3.5" />
                    ) : (
                      <Ban className="size-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => deleteUser(u._id)}
                    disabled={actionLoading === u._id || u.role === "admin"}
                    className="text-red-500 hover:bg-red-50 disabled:opacity-30"
                    title="Delete user"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
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
