import { useEffect, useState } from "react"
import {
  HeartHandshake,
  Loader2,
  PhoneCall,
  ShieldCheck,
} from "lucide-react"
import { Link } from "react-router-dom"

import { api } from "@/lib/api"
import {
  emptySafetyPlan,
  SAFETY_PLAN_SECTIONS,
  safetyPlanHasContent,
  type SafetyPlan,
} from "@/lib/safetyPlan"

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
// crisis or the user taps "Need help now". The user's safety plan is shown
// first, then region-appropriate hotlines, then the option to notify their
// assigned therapist (POST /api/crisis/message-therapist).
export function CrisisActions({ open, hotlines, onClose }: CrisisActionsProps) {
  const [contacting, setContacting] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(
    null
  )
  const [plan, setPlan] = useState<SafetyPlan>(emptySafetyPlan)
  const [planLoaded, setPlanLoaded] = useState(false)

  useEffect(() => {
    if (!open || planLoaded) return
    let mounted = true
    async function loadPlan() {
      try {
        const { data } = await api.get<SafetyPlan>("/api/safety-plan")
        if (mounted) setPlan({ ...emptySafetyPlan(), ...data })
      } catch {
        /* Plan is optional - hotlines remain the fallback. */
      } finally {
        if (mounted) setPlanLoaded(true)
      }
    }
    void loadPlan()
    return () => {
      mounted = false
    }
  }, [open, planLoaded])

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

  const hasPlan = safetyPlanHasContent(plan)

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

      {hasPlan && (
        <div className="mt-3 rounded-xl bg-white p-4 dark:bg-gray-900">
          <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase dark:text-emerald-400">
            <ShieldCheck className="size-3.5" /> Your safety plan
          </p>
          <div className="mt-2 space-y-3">
            {SAFETY_PLAN_SECTIONS.filter((s) => plan[s.key].length > 0).map(
              (section) => (
                <div key={section.key}>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {section.label}
                  </p>
                  <ul className="mt-0.5 list-inside list-disc space-y-0.5">
                    {plan[section.key].map((item, i) => (
                      <li key={`${item}-${i}`} className="text-sm text-gray-800 dark:text-gray-200">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
          <Link
            to="/safety-plan"
            className="mt-3 inline-block text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Edit safety plan
          </Link>
        </div>
      )}

      <div className="mt-3 space-y-2">
        <p className="text-xs font-semibold text-red-600/80 uppercase dark:text-red-400/80">
          Hotlines
        </p>
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
