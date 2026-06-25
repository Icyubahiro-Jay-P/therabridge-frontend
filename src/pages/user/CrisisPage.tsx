import { useEffect, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Heart,
  Loader2,
  Phone,
  Shield,
  TriangleAlert,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface CrisisAlert {
  _id: string
  alertType: string
  description: string
  status: string
  createdAt: string
  resourcesShared: string[]
}

const alertTypes = [
  { value: "immediate_danger", label: "Immediate Danger", color: "bg-red-500", severity: "Critical" },
  { value: "severe_distress", label: "Severe Distress", color: "bg-orange-500", severity: "High" },
  { value: "panic_attack", label: "Panic Attack", color: "bg-amber-500", severity: "Medium" },
  { value: "self_harm_thoughts", label: "Self-Harm Thoughts", color: "bg-red-600", severity: "Critical" },
  { value: "emergency", label: "Emergency", color: "bg-red-700", severity: "Emergency" },
]

const emergencyContacts = [
  { name: "Emergency Services", number: "911", description: "For immediate danger" },
  { name: "Suicide & Crisis Lifeline", number: "988", description: "24/7 support" },
  { name: "Crisis Text Line", number: "741741", description: "Text HOME to connect" },
]

export function CrisisPage() {
  const [alertType, setAlertType] = useState("")
  const [description, setDescription] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resources, setResources] = useState<string[]>([])
  const [myAlerts, setMyAlerts] = useState<CrisisAlert[]>([])
  const [loadingAlerts, setLoadingAlerts] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<CrisisAlert[]>("/api/crisis/mine")
        setMyAlerts(data)
      } catch {} finally {
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
      const { data } = await api.post("/api/crisis", { alertType, description })
      setSent(true)
      setResources(data.resources || [])
      setMyAlerts((prev) => [data.crisis, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send alert")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="size-6 text-red-600 dark:text-red-400" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crisis Support</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">If you're in immediate danger, call 911 right away.</p>
        </div>
      </div>

      {/* Emergency contacts */}
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/30">
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-red-700 dark:text-red-400">
          <Phone className="size-4" /> Emergency Contacts
        </h2>
        <div className="space-y-2">
          {emergencyContacts.map((c) => (
            <div key={c.number} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 dark:bg-gray-900">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</p>
                <p className="text-xs text-gray-400">{c.description}</p>
              </div>
              <a href={`tel:${c.number}`} className="text-lg font-bold text-red-600 hover:underline dark:text-red-400">{c.number}</a>
            </div>
          ))}
        </div>
      </div>

      {sent ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900/50 dark:bg-emerald-950/30">
          <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
          <h2 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">Help is on the way</h2>
          <p className="mt-1 text-sm text-gray-500">Your alert has been sent to our support team.</p>
          {resources.length > 0 && (
            <div className="mt-4 text-left">
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Resources for you:</p>
              <ul className="space-y-1">
                {resources.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Heart className="mt-0.5 size-3.5 shrink-0 text-red-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button onClick={() => { setSent(false); setAlertType(""); setDescription(""); setResources([]) }} variant="outline" className="mt-4">
            Send another alert
          </Button>
        </div>
      ) : (
        <>
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              <TriangleAlert className="size-4 shrink-0" /> {error}
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Request support</h2>

            <div className="mb-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">What are you experiencing?</p>
              {alertTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setAlertType(t.value)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                    alertType === t.value
                      ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                      : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  )}
                >
                  <span className={cn("flex size-3 shrink-0 rounded-full", t.color)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t.label}</p>
                    <p className="text-xs text-gray-400">{t.severity}</p>
                  </div>
                </button>
              ))}
            </div>

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you're feeling (optional)..."
              maxLength={1000}
              rows={3}
              className="mb-4"
            />

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

      {/* My alerts history */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">My alerts</h2>
        {loadingAlerts ? (
          <div className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-gray-400" /></div>
        ) : myAlerts.length === 0 ? (
          <p className="text-sm text-gray-400">No previous alerts.</p>
        ) : (
          <div className="space-y-2">
            {myAlerts.slice(0, 10).map((a) => {
              // const typeInfo = alertTypes.find((t) => t.value === a.alertType)
              return (
                <div key={a._id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                  <Shield className={cn("size-5", a.status === "active" ? "text-red-500" : a.status === "acknowledged" ? "text-amber-500" : "text-emerald-500")} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{a.alertType.replace(/_/g, " ")}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(a.createdAt).toLocaleDateString()} · {a.status}
                    </p>
                  </div>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    a.status === "active" ? "bg-red-100 text-red-700 dark:bg-red-900/40" :
                    a.status === "acknowledged" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40" :
                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40"
                  )}>
                    {a.status}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
