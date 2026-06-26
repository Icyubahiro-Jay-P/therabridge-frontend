import { useEffect, useState } from "react"
import { Loader2, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { ClientListItem } from "./components/ClientListItem"
import { ClientProfilePanel } from "./components/ClientProfilePanel"
import { ClientsEmptyState } from "./components/ClientsEmptyState"

interface ChatUser { _id: string; username: string; firstName: string; lastName: string }
interface FullUserData {
  _id: string; username: string; firstName: string; lastName: string; email: string
  dateOfBirth: string; bio: string; role: string; createdAt: string
  exerciseScore: number; exerciseStreak: number
}

export function TherapistClientsPage() {
  const [clients, setClients] = useState<ChatUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<FullUserData | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get("/api/chat/conversations")
        setClients((data as { partner: ChatUser }[]).map((c) => c.partner))
      } catch {} finally { setLoading(false) }
    }
    void load()
  }, [])

  const filtered = clients.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return c.firstName.toLowerCase().includes(q) || c.lastName.toLowerCase().includes(q) || c.username.toLowerCase().includes(q)
  })

  async function viewProfile(userId: string) {
    setLoadingProfile(true); setProfileError(null)
    try {
      const { data } = await api.get<FullUserData>(`/api/users/therapist/user/${userId}`)
      setSelectedUser(data)
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to load profile")
    } finally { setLoadingProfile(false) }
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My clients</h1>
        <p className="mt-2 text-muted-foreground">People you have been in conversation with. View their full profiles.</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="size-6 animate-spin text-gray-400" /></div>
      ) : filtered.length === 0 ? (
        <ClientsEmptyState search={search} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/60">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((client) => <ClientListItem key={client._id} client={client} onViewProfile={viewProfile} />)}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
            <ClientProfilePanel loading={loadingProfile} error={profileError} user={selectedUser} onClose={() => setSelectedUser(null)} />
          </div>
        </div>
      )}
    </div>
  )
}
