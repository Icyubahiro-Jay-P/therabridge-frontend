import { useEffect, useState } from "react"
import { Loader2, TriangleAlert, AlertCircle, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { LIMITS } from "@/lib/limits"
import { CrisisHeader } from "@/components/user/crisis/CrisisHeader"
import { EmergencyContacts } from "@/components/user/crisis/EmergencyContacts"
import { AlertTypeSelector } from "@/components/user/crisis/AlertTypeSelector"
import { CrisisAlertSuccess } from "@/components/user/crisis/CrisisAlertSuccess"
import { AlertHistory } from "@/components/user/crisis/AlertHistory"
import { ExerciseModal } from "@/components/user/exercises/ExerciseModal"
import type { Exercise } from "@/components/user/exercises/types"

interface CrisisAlert {
  _id: string
  alertType: string
  severity: string
  description: string
  status: string
  createdAt: string
}

const severityOptions = [
  { value: "mild", label: "Mild", color: "bg-emerald-500", hint: "Unpleasant but manageable" },
  { value: "medium", label: "Moderate", color: "bg-amber-500", hint: "Hard to cope with" },
  { value: "severe", label: "Severe", color: "bg-red-600", hint: "Can't cope or unsafe" },
]

export function CrisisPage() {
  const [alertType, setAlertType] = useState("")
  const [severity, setSeverity] = useState("medium")
  const [requestContact, setRequestContact] = useState(false)
  const [description, setDescription] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resources, setResources] = useState<string[]>([])
  const [myAlerts, setMyAlerts] = useState<CrisisAlert[]>([])
  const [loadingAlerts, setLoadingAlerts] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<CrisisAlert[]>("/api/crisis/mine")
        setMyAlerts(data)
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load history")
      } finally {
        setLoadingAlerts(false)
      }
    }
    void load()
  }, [])

  async function handleSubmit() {
    if (!alertType) return
    setSending(true)
    setError(null)
    try {
      const { data } = await api.post("/api/crisis", { alertType, description, severity, requestContact }, {
        headers: { "Idempotency-Key": `crisis-${Date.now()}-${Math.random().toString(36).slice(2)}` },
      })
      setSent(true)
      setResources(data.resources || [])
      setMyAlerts((prev) => [data.crisis, ...prev])
      if (data.panicExercise) {
        setActiveExercise(data.panicExercise)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send alert")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {activeExercise && (
        <ExerciseModal
          exercise={activeExercise}
          onClose={() => setActiveExercise(null)}
        />
      )}
      <div className="mx-auto max-w-2xl space-y-8 p-6">
      <CrisisHeader />
      <EmergencyContacts />

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              My safety plan
            </p>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
              Build or review the plan shown first when you need help
            </p>
          </div>
        </div>
        <Link
          to="/safety-plan"
          className="shrink-0 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Open
        </Link>
      </div>

      {sent ? (
        <CrisisAlertSuccess
          resources={resources}
          onReset={() => { setSent(false); setAlertType(""); setSeverity("medium"); setRequestContact(false); setDescription(""); setResources([]) }}
        />
      ) : (
        <>
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              <TriangleAlert className="size-4 shrink-0" /> {error}
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Request support</h2>
            <AlertTypeSelector value={alertType} onChange={setAlertType} />

            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">How bad is it right now?</p>
              <div className="grid grid-cols-3 gap-2">
                {severityOptions.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSeverity(s.value)}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-xl border px-3 py-2 text-left transition-all",
                      severity === s.value
                        ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                        : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className={cn("size-2.5 rounded-full", s.color)} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{s.label}</span>
                    </span>
                    <span className="text-[11px] text-gray-400">{s.hint}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Severe alerts notify your care team immediately. Moderate alerts notify them non-urgently.
              </p>
            </div>

            <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={requestContact}
                onChange={(e) => setRequestContact(e.target.checked)}
                className="size-4 rounded border-gray-300 text-red-600 focus:ring-red-500 dark:border-gray-600"
              />
              I'd like to be contacted about this alert
            </label>

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, LIMITS.crisis.description))}
              placeholder="Describe what you're feeling (optional)..."
              maxLength={LIMITS.crisis.description}
              rows={3}
              className="mb-1"
            />
            <div className="mb-4 flex justify-end">
              <span className="text-xs tabular-nums text-gray-400 dark:text-gray-500">
                {description.length}/{LIMITS.crisis.description}
              </span>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!alertType || sending}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {sending ? <Loader2 className="size-4 animate-spin" /> : "Send alert"}
            </Button>
          </div>
        </>
      )}

      {loadError && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
          <AlertCircle className="size-4 shrink-0" /> {loadError}
        </div>
      )}

      <AlertHistory alerts={myAlerts} loading={loadingAlerts} />
      </div>
    </>
  )
}
