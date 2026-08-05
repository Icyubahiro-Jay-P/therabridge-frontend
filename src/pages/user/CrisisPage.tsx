import { useEffect, useState } from "react"
import { Loader2, TriangleAlert, AlertCircle } from "lucide-react"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { LIMITS } from "@/lib/limits"
import { CrisisHeader } from "@/components/user/crisis/CrisisHeader"
import { EmergencyContacts } from "@/components/user/crisis/EmergencyContacts"
import { AlertTypeSelector } from "@/components/user/crisis/AlertTypeSelector"
import { CrisisAlertSuccess } from "@/components/user/crisis/CrisisAlertSuccess"
import { AlertHistory } from "@/components/user/crisis/AlertHistory"

interface CrisisAlert {
  _id: string
  alertType: string
  description: string
  status: string
  createdAt: string
}

export function CrisisPage() {
  const [alertType, setAlertType] = useState("")
  const [description, setDescription] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resources, setResources] = useState<string[]>([])
  const [myAlerts, setMyAlerts] = useState<CrisisAlert[]>([])
  const [loadingAlerts, setLoadingAlerts] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

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
      <CrisisHeader />
      <EmergencyContacts />

      {sent ? (
        <CrisisAlertSuccess
          resources={resources}
          onReset={() => { setSent(false); setAlertType(""); setDescription(""); setResources([]) }}
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
  )
}
