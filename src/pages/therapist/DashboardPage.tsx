import { useEffect, useState } from "react"
import { Hash, Loader2, MessageCircle, Plus, UserPlus, Users } from "lucide-react"

import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { TherapistStatCard } from "@/components/therapist/TherapistStatCard"
import { TherapistCommunityCard } from "@/components/therapist/TherapistCommunityCard"
import { CreateCommunityModal } from "@/components/user/community/CreateCommunityModal"
import { InviteClientModal } from "@/components/therapist/InviteClientModal"
import type { Community } from "@/components/user/community/types"

interface RosterUser {
  _id: string
  firstName: string
  lastName: string
  username: string
  email?: string
  avatar?: string | null
}

export function TherapistDashboardPage() {
  const user = useAuthStore((state) => state.user)
  const [communities, setCommunities] = useState<Community[]>([])
  const [clients, setClients] = useState<RosterUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showInvite, setShowInvite] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [{ data: communitiesData }, { data: clientsData }] = await Promise.all([
          api.get<Community[]>("/api/chat/communities"),
          api.get<RosterUser[]>("/api/users/therapist/clients"),
        ])
        setCommunities(communitiesData)
        setClients(clientsData)
      } catch {
        // Ignore - dashboard renders with whatever data loaded.
      } finally {
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
  const totalMembers = ownerCommunities.reduce((sum, c) => sum + c.members.length, 0)

  return (
    <div className="space-y-8 p-6">
      {showCreate && (
        <CreateCommunityModal
          onClose={() => setShowCreate(false)}
          onCreate={(c) => {
            setCommunities((prev) => (prev.find((p) => p._id === c._id) ? prev : [c, ...prev]))
          }}
        />
      )}
      {showInvite && (
        <InviteClientModal
          clients={clients}
          communities={ownerCommunities}
          onClose={() => setShowInvite(false)}
          onInvited={() => {}}
        />
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Therapist dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back, {user?.firstName}. Manage your communities, invite your clients, and stay in the loop.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowInvite(true)}
            disabled={clients.length === 0 || ownerCommunities.length === 0}
            title={clients.length === 0 ? "Add clients first (from your Clients page)" : ownerCommunities.length === 0 ? "Create a community first" : "Invite a client into one of your communities"}
          >
            <UserPlus className="size-4" /> Invite client
          </Button>
          <Button
            size="sm"
            onClick={() => setShowCreate(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="size-4" /> Create community
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <TherapistStatCard icon={Hash} value={ownerCommunities.length} label="Communities you own" color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40" />
        <TherapistStatCard icon={Users} value={totalMembers} label="Total members" color="bg-sky-100 text-sky-600 dark:bg-sky-900/40" />
        <TherapistStatCard icon={MessageCircle} value={memberCommunities.length} label="Communities joined" color="bg-violet-100 text-violet-600 dark:bg-violet-900/40" />
      </div>

      {clients.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Your clients ({clients.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {clients.map((client) => (
              <span
                key={client._id}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pr-3 pl-1 text-sm dark:border-gray-700/60 dark:bg-gray-900"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600 dark:bg-emerald-900/40">
                  {client.firstName[0]}{client.lastName[0]}
                </span>
                {client.firstName} {client.lastName}
              </span>
            ))}
          </div>
        </div>
      )}

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
