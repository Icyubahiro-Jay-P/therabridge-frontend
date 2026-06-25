import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Eye,
  EyeOff,
  Loader2,
  MessageCircle,
  Search,
  User as UserIcon,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"

interface ChatUser {
  _id: string
  username: string
  firstName: string
  lastName: string
  avatar?: string | null
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
  avatar?: string | null
  createdAt: string
  exerciseScore: number
  loginStreak: number
  exerciseStreak: number
}

export function TherapistClientsPage() {
  const navigate = useNavigate()
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
        const convs = data as { partner: ChatUser }[]
        const partners = convs.map((c) => c.partner)
        setClients(partners)
      } catch {} finally {
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
      const { data } = await api.get<FullUserData>(`/api/users/therapist/user/${userId}`)
      setSelectedUser(data)
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to load profile")
    } finally {
      setLoadingProfile(false)
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My clients</h1>
        <p className="mt-2 text-muted-foreground">
          People you have been in conversation with. View their full profiles.
        </p>
      </div>

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
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <UserIcon className="size-12 text-gray-300" />
          <p className="text-sm text-gray-400">
            {search ? "No clients match your search." : "No conversations yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/60">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((client) => (
                <div
                  key={client._id}
                  className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                      {client.firstName[0]}{client.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {client.firstName} {client.lastName}
                      </p>
                      <p className="text-xs text-gray-400">@{client.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewProfile(client._id)}
                      className="text-xs"
                    >
                      <Eye className="size-3.5" /> Profile
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/chat/${client.username}`)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                    >
                      <MessageCircle className="size-3.5" /> Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile detail panel */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
            {loadingProfile ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="size-6 animate-spin text-gray-400" />
              </div>
            ) : profileError ? (
              <div className="flex h-full items-center justify-center text-sm text-red-500">{profileError}</div>
            ) : selectedUser ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Client profile</h3>
                  <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="size-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-600 dark:bg-emerald-900/40">
                      {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </p>
                      <p className="text-sm text-gray-400">@{selectedUser.username}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedUser.email}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                      <p className="text-xs text-gray-400">Date of Birth</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                      <p className="text-xs text-gray-400">Role</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{selectedUser.role}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                      <p className="text-xs text-gray-400">Member since</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                      <p className="text-xs text-gray-400">EX Score</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedUser.exerciseScore || 0}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                      <p className="text-xs text-gray-400">Streak</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedUser.exerciseStreak || 0} days</p>
                    </div>
                  </div>

                  {selectedUser.bio && (
                    <div>
                      <p className="mb-1 text-xs text-gray-400">Bio</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{selectedUser.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <EyeOff className="mx-auto size-8 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-400">Select a client to view their full profile</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
