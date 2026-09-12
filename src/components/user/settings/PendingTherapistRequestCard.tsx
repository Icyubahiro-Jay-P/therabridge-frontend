import { useState } from "react"
import { Check, HeartHandshake, X } from "lucide-react"
import { api } from "@/lib/api"
import { useAuthStore } from "@/store/auth-store"
import { getErrorMessage } from "@/lib/errors"

export function PendingTherapistRequestCard() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const [responding, setResponding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = user?.pendingTherapistRequest
  if (!user || !request) return null

  async function respond(action: "approve" | "reject") {
    setResponding(true)
    setError(null)
    try {
      await api.post("/api/users/therapist-request/respond", { action })
      setUser({ ...user!, pendingTherapistRequest: null })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setResponding(false)
    }
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
        Therapist request
      </h2>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
            <HeartHandshake className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {request.firstName} {request.lastName} wants to be your therapist
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Accepting gives them access to your safety plan, crisis alerts, and profile.
            </p>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => respond("approve")}
            disabled={responding}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <Check className="size-3.5" /> Accept
          </button>
          <button
            onClick={() => respond("reject")}
            disabled={responding}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <X className="size-3.5" /> Decline
          </button>
        </div>
      </div>
    </section>
  )
}
