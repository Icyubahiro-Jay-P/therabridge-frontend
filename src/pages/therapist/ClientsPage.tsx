import { useEffect, useState } from "react"
import { Loader2, Plus, Search, UserPlus } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { ClientListItem } from "@/components/therapist/ClientListItem"
import {
  ClientProfilePanel,
  type ProfileData,
} from "@/components/therapist/ClientProfilePanel"
import { ClientsEmptyState } from "@/components/therapist/ClientsEmptyState"
import type { ClientRiskSummary } from "@/lib/riskSummary"

interface ChatUser {
  _id: string
  username: string
  firstName: string
  lastName: string
}
interface FullUserData {
  _id: string
  username: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  bio: string
  role: string
  createdAt: string
  exerciseScore: number
  exerciseStreak: number
}

export function TherapistClientsPage() {
  const [clients, setClients] = useState<ChatUser[]>([])
  const [discover, setDiscover] = useState<ChatUser[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<ProfileData | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [riskSummaries, setRiskSummaries] = useState<
    Record<string, ClientRiskSummary>
  >({})

  useEffect(() => {
    async function load() {
      try {
        const [roster, conversations, risk] = await Promise.all([
          api.get<ChatUser[]>("/api/users/therapist/clients"),
          api.get<{ data: { partner: ChatUser }[] }>("/api/chat/conversations"),
          api.get<{ clients: ClientRiskSummary[] }>(
            "/api/therapist/clients/risk-summary"
          ),
        ])
        const rosterIds = new Set(roster.data.map((c) => c._id))
        setClients(roster.data)
        setDiscover(
          conversations.data.data
            .map((c) => c.partner)
            .filter((p) => !rosterIds.has(p._id))
        )
        setRiskSummaries(
          Object.fromEntries(
            risk.data.clients.map((summary) => [summary.userId, summary])
          )
        )
      } catch {
        // Ignore - page renders with whatever data loaded.
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const filtered = clients.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.username.toLowerCase().includes(q)
    )
  })

  async function viewProfile(userId: string) {
    setLoadingProfile(true)
    setProfileError(null)
    try {
      const { data } = await api.get<FullUserData>(
        `/api/users/therapist/user/${userId}`
      )
      setSelectedUser({
        id: data._id,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        bio: data.bio,
        role: data.role,
        createdAt: data.createdAt,
        exerciseScore: data.exerciseScore,
        exerciseStreak: data.exerciseStreak,
      })
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : "Failed to load profile"
      )
    } finally {
      setLoadingProfile(false)
    }
  }

  async function addClient(userId: string) {
    setAdding(userId)
    try {
      const { data } = await api.post<{ client: ChatUser }>("/api/users/therapist/clients", { userId })
      setClients((prev) => [...prev, data.client])
      setDiscover((prev) => prev.filter((p) => p._id !== userId))
    } catch {
      // Backend rejects (e.g. user already has a therapist) - ignore for now.
    } finally {
      setAdding(null)
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My clients</h1>
        <p className="mt-2 text-muted-foreground">
          The users you manage. Add people you've chatted with to your client roster to bring them into your communities.
        </p>
      </div>

      {discover.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <UserPlus className="size-4 text-emerald-600" /> Add from conversations
          </h2>
          <div className="flex flex-wrap gap-2">
            {discover.map((p) => (
              <span
                key={p._id}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 py-1 pr-1.5 pl-1 text-sm dark:border-gray-700/60"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500 dark:bg-gray-800">
                  {p.firstName[0]}{p.lastName[0]}
                </span>
                {p.firstName} {p.lastName}
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => addClient(p._id)}
                  disabled={adding === p._id}
                  className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                >
                  {adding === p._id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Plus className="size-3.5" />
                  )}
                  Add
                </Button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-gray-400" />
        </div>
      ) : filtered.length === 0 ? (
        <ClientsEmptyState search={search} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/60">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((client) => (
                <ClientListItem
                  key={client._id}
                  client={client}
                  summary={riskSummaries[client._id]}
                  onViewProfile={viewProfile}
                />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
            <ClientProfilePanel
              loading={loadingProfile}
              error={profileError}
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
