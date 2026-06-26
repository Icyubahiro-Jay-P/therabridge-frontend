import { useEffect, useState } from "react"
import { Loader2, Users } from "lucide-react"

import { api } from "@/lib/api"
import { AdminCommunityCard } from "./components/AdminCommunityCard"
import { AdminEmptyState } from "./components/AdminEmptyState"
import { FeedbackBanner } from "./components/FeedbackBanner"
import { SearchBar } from "./components/SearchBar"
import { PageHeader } from "./components/PageHeader"

interface AdminCommunity {
  _id: string; name: string; description: string; inviteKey: string
  members: { _id: string; firstName: string; lastName: string }[]
  owner: { _id: string; firstName: string; lastName: string }
}

export function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<AdminCommunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<AdminCommunity[]>("/api/chat/communities")
        setCommunities(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load communities")
      } finally { setLoading(false) }
    }
    void load()
  }, [])

  const filtered = communities.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.inviteKey.toLowerCase().includes(q) || c.owner.firstName.toLowerCase().includes(q)
  })

  async function handleDelete(id: string) {
    if (!confirm("Delete this community? This cannot be undone.")) return
    setActionLoading(id); setError(null); setSuccess(null)
    try {
      await api.delete(`/api/chat/communities/${id}`)
      setCommunities((prev) => prev.filter((c) => c._id !== id))
      setSuccess("Community deleted.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete")
    } finally { setActionLoading(null) }
  }

  return (
    <div className="space-y-8 p-6">
      <PageHeader title="Community management" description="Overview of all communities on the platform. Admins can delete communities." />
      {error && <FeedbackBanner type="error" message={error} />}
      {success && <FeedbackBanner type="success" message={success} />}
      <SearchBar value={search} onChange={setSearch} placeholder="Search communities..." />
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="size-6 animate-spin text-gray-400" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => <AdminCommunityCard key={c._id} community={c} actionLoading={actionLoading} onDelete={handleDelete} />)}
          {filtered.length === 0 && <AdminEmptyState icon={Users} message="No communities found." />}
        </div>
      )}
    </div>
  )
}
