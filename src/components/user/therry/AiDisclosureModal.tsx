import { useState } from "react"
import { BotIcon, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

interface AiDisclosureModalProps {
  open: boolean
  onAcknowledge: () => void
}

// Persistent disclosure that Therry is an AI companion, not a licensed
// therapist. Shown until the user acknowledges (stored server-side on the
// user record via POST /api/users/ai-disclosure).
export function AiDisclosureModal({ open, onAcknowledge }: AiDisclosureModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  async function acknowledge() {
    setLoading(true)
    setError(null)
    try {
      await api.post("/api/users/ai-disclosure")
      onAcknowledge()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save your acknowledgement. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-1 flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
          <BotIcon className="size-6 text-emerald-600" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          A note about Therry
        </h3>
        <div className="mt-2 space-y-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          <p>
            Therry is an AI companion, not a licensed therapist or medical
            provider. It is here to listen and support you, but it cannot
            diagnose, treat, or replace professional care.
          </p>
          <p>
            If you are in immediate danger or thinking about harming yourself,
            please call <strong className="text-gray-700 dark:text-gray-200">911</strong> or{" "}
            <strong className="text-gray-700 dark:text-gray-200">988</strong> right away.
          </p>
          <p>
            Your conversations are encrypted and stored securely so you can
            track your journey.
          </p>
        </div>
        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="mt-5 flex gap-3">
          <a
            href="/crisis"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Crisis support
          </a>
          <button
            onClick={acknowledge}
            disabled={loading}
            className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="mx-auto size-4 animate-spin" /> : "I understand"}
          </button>
        </div>
      </div>
    </div>
  )
}
