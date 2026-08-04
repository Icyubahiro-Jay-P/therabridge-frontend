import { useState } from "react"
import { Loader2, TriangleAlert, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { getErrorMessage } from "@/components/user/community/utils"

interface RosterUser {
  _id: string
  firstName: string
  lastName: string
  username: string
  email?: string
  avatar?: string | null
}

interface TherapistCommunity {
  _id: string
  name: string
  inviteKey: string
  members: { _id: string; firstName: string; lastName: string }[]
}

export function InviteClientModal({
  clients,
  communities,
  onClose,
  onInvited,
}: {
  clients: RosterUser[]
  communities: TherapistCommunity[]
  onClose: () => void
  onInvited: () => void
}) {
  const [clientId, setClientId] = useState("")
  const [communityId, setCommunityId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const community = communities.find((c) => c._id === communityId)
  const alreadyMembers = new Set(community?.members.map((m) => m._id) ?? [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientId || !communityId) return
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await api.post(`/api/chat/communities/${communityId}/invite`, { userId: clientId })
      setSuccess("Client added to the community.")
      onInvited()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Invite client to community
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="size-5" />
          </button>
        </div>
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            <TriangleAlert className="inline size-4 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Client
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="" disabled>
                Select a client...
              </option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.firstName} {c.lastName} (@{c.username})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Community
            </label>
            <select
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="" disabled>
                Select a community you own...
              </option>
              {communities.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.members.length} members)
                </option>
              ))}
            </select>
            {community && clientId && alreadyMembers.has(clientId) && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                This client is already a member of this community.
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading || (communityId !== "" && clientId !== "" && alreadyMembers.has(clientId))}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="size-4" /> Add client
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
