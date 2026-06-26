import { useEffect, useState } from "react"
import { Hash, Loader2, MessageCircle, Users } from "lucide-react"

import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"
import { TherapistStatCard } from "./components/TherapistStatCard"
import { TherapistCommunityCard } from "./components/TherapistCommunityCard"

interface TherapistCommunity {
  _id: string
  name: string
  inviteKey: string
  members: { _id: string; firstName: string; lastName: string }[]
  owner: { _id: string; firstName: string; lastName: string }
  description?: string
}

export function TherapistDashboardPage() {
  const user = useAuthStore((state) => state.user)
  const [communities, setCommunities] = useState<TherapistCommunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<TherapistCommunity[]>("/api/chat/communities")
        setCommunities(data)
      } catch {} finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-gray-400" />
      </div>
    )
  }

  const ownerCommunities = communities.filter((c) => c.owner._id === user?.id)
  const memberCommunities = communities.filter((c) => c.owner._id !== user?.id)

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Therapist dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {user?.firstName}. Manage your communities and clients.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <TherapistStatCard icon={Hash} value={ownerCommunities.length} label="Communities you own" color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40" />
        <TherapistStatCard icon={Users} value={ownerCommunities.reduce((sum, c) => sum + c.members.length, 0)} label="Total members" color="bg-sky-100 text-sky-600 dark:bg-sky-900/40" />
        <TherapistStatCard icon={MessageCircle} value={memberCommunities.length} label="Communities joined" color="bg-violet-100 text-violet-600 dark:bg-violet-900/40" />
      </div>

      {ownerCommunities.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Your communities (owner)</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ownerCommunities.map((c) => <TherapistCommunityCard key={c._id} community={c} isOwner />)}
          </div>
        </div>
      )}

      {memberCommunities.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Communities you're in</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {memberCommunities.map((c) => <TherapistCommunityCard key={c._id} community={c} isOwner={false} />)}
          </div>
        </div>
      )}
    </div>
  )
}
