import { useState } from "react"
import { HeartHandshake, Loader2, PhoneCall } from "lucide-react"
import { api } from "@/lib/api"

export interface Hotline {
  name: string
  phone: string | null
  website?: string
}

interface CrisisActionsProps {
  open: boolean
  hotlines: Hotline[]
  onClose: () => void
}

// Crisis escalation card shown when Therry classifies a conversation as a
// crisis. Lists region-appropriate hotlines and lets the user notify their
// assigned therapist (POST /api/crisis/message-therapist).
export function CrisisActions({ open, hotlines, onClose }: CrisisActionsProps) {
  const [contacting, setContacting] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(
    null
  )

  if (!open) return null

  async function notifyTherapist() {
    setContacting(true)
    setFeedback(null)
    try {
      const { data } = await api.post("/api/crisis/message-therapist")
      setFeedback({ ok: true, text: data.message })
    } catch (err) {
      setFeedback({
        ok: false,
        text:
          err instanceof Error
            ? err.message
            : "Could not reach your therapist right now.",
      })
    } finally {
      setContacting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-400">
          <PhoneCall className="size-4" /> You're not alone - help is available
        </h3>
        <button
          onClick={onClose}
          className="text-xs font-medium text-red-600 hover:underline dark:text-red-400"
        >
          Dismiss
        </button>
      </div>
      <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/80">
        If you are in immediate danger, call 911 now.
      </p>
      <div className="mt-3 space-y-2">
        {hotlines.length > 0 ? (
          hotlines.map((h) => (
            <div
              key={h.name}
              className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5 dark:bg-gray-900"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {h.name}
                </p>
                {h.website && (
                  <p className="text-xs text-gray-400">
                    {h.website.replace(/^https?:\/\//, "")}
                  </p>
                )}
              </div>
              {h.phone ? (
                <a
                  href={`tel:${h.phone}`}
                  className="text-base font-bold text-red-600 hover:underline dark:text-red-400"
                >
                  {h.phone}
                </a>
              ) : h.website ? (
                <a
                  href={h.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-red-600 hover:underline dark:text-red-400"
                >
                  Open
                </a>
              ) : null}
            </div>
          ))
        ) : (
          <p className="text-xs text-red-700 dark:text-red-400">
            Emergency services: 911 · Suicide & Crisis Lifeline: 988
          </p>
        )}
      </div>
      <div className="mt-3">
        <button
          onClick={notifyTherapist}
          disabled={contacting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {contacting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <HeartHandshake className="size-4" />
          )}
          {feedback?.ok ? "Therapist notified" : "Notify my therapist"}
        </button>
        {feedback && !feedback.ok && (
          <p className="mt-2 text-xs text-red-700 dark:text-red-400">{feedback.text}</p>
        )}
        {feedback?.ok && (
          <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">
            {feedback.text}
          </p>
        )}
      </div>
    </div>
  )
}
