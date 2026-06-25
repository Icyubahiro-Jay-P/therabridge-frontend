import { useEffect, useState } from "react"
import {
  CheckCircle2,
  Hash,
  Loader2,
  Search,
  TriangleAlert,
  Trash2,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"

interface AdminCommunity {
  _id: string
  name: string
  description: string
  inviteKey: string
  members: { _id: string; firstName: string; lastName: string }[]
  owner: { _id: string; firstName: string; lastName: string }
  createdAt?: string
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
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const filtered = communities.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.inviteKey.toLowerCase().includes(q) ||
      c.owner.firstName.toLowerCase().includes(q)
    )
  })

  async function handleDelete(id: string) {
    if (!confirm("Delete this community? This cannot be undone.")) return
    setActionLoading(id)
    setError(null)
    setSuccess(null)
    try {
      await api.delete(`/api/chat/communities/${id}`)
      setCommunities((prev) => prev.filter((c) => c._id !== id))
      setSuccess("Community deleted.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete")
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Community management</h1>
        <p className="mt-2 text-muted-foreground">
          Overview of all communities on the platform. Admins can delete communities.
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
          placeholder="Search communities..."
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div
              key={c._id}
              className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700/60 dark:bg-gray-900"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                  <Hash className="size-5 text-emerald-600 dark:text-emerald-400" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900 dark:text-white">
                    {c.name}
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    by {c.owner.firstName} {c.owner.lastName}
                  </p>
                </div>
              </div>
              {c.description && (
                <p className="mt-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                  {c.description}
                </p>
              )}
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <Users className="size-3.5" />
                {c.members.length} member{c.members.length !== 1 ? "s" : ""}
                <span className="ml-auto font-mono">{c.inviteKey}</span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleDelete(c._id)}
                disabled={actionLoading === c._id}
                className="absolute top-3 right-3 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
              >
                {actionLoading === c._id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
              </Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
              <Users className="size-12 text-gray-300" />
              <p className="text-sm text-gray-400">No communities found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
