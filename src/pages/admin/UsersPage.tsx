import { useEffect, useState } from "react"
import { Loader2, UserCog } from "lucide-react"

import { api } from "@/lib/api"
import { AdminUserRow } from "./components/AdminUserRow"
import { AdminEmptyState } from "./components/AdminEmptyState"
import { FeedbackBanner } from "./components/FeedbackBanner"
import { SearchBar } from "./components/SearchBar"
import { PageHeader } from "./components/PageHeader"

interface AppUser {
  _id: string; username: string; firstName: string; lastName: string
  email: string; role: string; isDisabled?: boolean
}

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
      } finally { setLoading(false) }
    }
    void load()
  }, [])

  const filtered = users.filter((u) => {
    if (!search) return true
    const q = search.toLowerCase()
    return u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  async function toggleDisable(id: string) {
    setActionLoading(id); setError(null); setSuccess(null)
    try {
      const { data } = await api.put(`/api/users/admin/disable/${id}`)
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isDisabled: data.user.isDisabled } : u))
      setSuccess(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed")
    } finally { setActionLoading(null) }
  }

  async function changeRole(id: string, role: string) {
    setActionLoading(id); setError(null); setSuccess(null)
    try {
      const { data } = await api.put(`/api/users/admin/role/${id}`, { role })
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role: data.user.role } : u))
      setSuccess(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed")
    } finally { setActionLoading(null) }
  }

  async function deleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return
    setActionLoading(id); setError(null); setSuccess(null)
    try {
      await api.delete(`/api/users/admin/user/${id}`)
      setUsers((prev) => prev.filter((u) => u._id !== id))
      setSuccess("User deleted.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed")
    } finally { setActionLoading(null) }
  }

  return (
    <div className="space-y-8 p-6">
      <PageHeader title="User management" description="Manage all platform users — change roles, disable accounts, or remove users." />
      {error && <FeedbackBanner type="error" message={error} />}
      {success && <FeedbackBanner type="success" message={success} />}
      <SearchBar value={search} onChange={setSearch} placeholder="Search by name, username or email..." />
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="size-6 animate-spin text-gray-400" /></div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/60">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((u) => <AdminUserRow key={u._id} user={u} actionLoading={actionLoading} onToggleDisable={toggleDisable} onChangeRole={changeRole} onDelete={deleteUser} />)}
          </div>
          {filtered.length === 0 && <AdminEmptyState icon={UserCog} message="No users match your search." />}
        </div>
      )}
    </div>
  )
}
