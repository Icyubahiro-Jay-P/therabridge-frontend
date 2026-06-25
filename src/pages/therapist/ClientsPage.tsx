import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Loader2,
  MessageCircle,
  Search,
  User as UserIcon,
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

export function TherapistClientsPage() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<ChatUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

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

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My clients</h1>
        <p className="mt-2 text-muted-foreground">
          People you have been in conversation with.
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
                <Button
                  size="sm"
                  onClick={() => navigate(`/chat/${client.username}`)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <MessageCircle className="size-3.5" /> Message
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
