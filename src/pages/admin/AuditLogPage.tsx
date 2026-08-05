import { useEffect, useState } from "react"
import { CalendarDays, Loader2, ScrollText } from "lucide-react"
import { api } from "@/lib/api"
import { PageHeader } from "@/components/admin/PageHeader"
import { FeedbackBanner } from "@/components/admin/FeedbackBanner"
import { AdminEmptyState } from "@/components/admin/AdminEmptyState"

interface AuditActor {
  _id: string
  username: string
  firstName: string
  lastName: string
  role: string
}

interface AuditEntry {
  _id: string
  actor: AuditActor | null
  actorRole: string
  action: string
  targetType: string
  target: AuditActor | null
  detail: Record<string, unknown>
  ip: string | null
  userAgent: string | null
  createdAt: string
}

interface AuditPage {
  data: AuditEntry[]
  total: number
  page: number
  totalPages: number
  limit: number
}

const ACTION_LABELS: Record<string, string> = {
  user_profile_view: "User profile viewed",
  client_roster_view: "Client roster viewed",
  crisis_view: "Crisis data viewed",
  data_export: "Data exported",
  account_deletion: "Account deleted",
  ai_disclosure_ack: "AI disclosure acknowledged",
}

const ACTION_OPTIONS = Object.entries(ACTION_LABELS)

function actorName(actor: AuditActor | null, fallback: string): string {
  if (!actor) return fallback
  return `${actor.firstName || actor.username} ${actor.lastName || ""}`.trim()
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [action, setAction] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const params = new URLSearchParams()
        params.set("limit", "100")
        if (action) params.set("action", action)
        if (from) params.set("from", new Date(from).toISOString())
        if (to) params.set("to", new Date(`${to}T23:59:59`).toISOString())
        const { data } = await api.get<AuditPage>(`/api/audit?${params.toString()}`)
        if (cancelled) return
        setLogs(data.data ?? [])
        setTotal(data.total ?? 0)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load audit log")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [action, from, to])

  function updateFilter(next: { action?: string; from?: string; to?: string }) {
    setLoading(true)
    setLogs([])
    setError(null)
    if (next.action !== undefined) setAction(next.action)
    if (next.from !== undefined) setFrom(next.from)
    if (next.to !== undefined) setTo(next.to)
  }

  const filterInputs =
    "rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Audit log"
        description="Privacy-sensitive access to user and crisis data is logged here for accountability."
      />
      {error && <FeedbackBanner type="error" message={error} />}

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Action</label>
          <select
            value={action}
            onChange={(e) => updateFilter({ action: e.target.value })}
            className={filterInputs}
          >
            <option value="">All actions</option>
            {ACTION_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => updateFilter({ from: e.target.value })}
            className={filterInputs}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => updateFilter({ to: e.target.value })}
            className={filterInputs}
          />
        </div>
        <span className="pb-2 text-xs text-gray-400">
          {total} event{total === 1 ? "" : "s"}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-gray-400" />
        </div>
      ) : logs.length === 0 ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/60">
          <AdminEmptyState icon={ScrollText} message="No audit events match your filters." />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/60">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {logs.map((entry) => (
              <div key={entry._id} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {ACTION_LABELS[entry.action] ?? entry.action}
                  </p>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <CalendarDays className="size-3.5" /> {formatDate(entry.createdAt)}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    By <span className="font-medium text-gray-700 dark:text-gray-200">{actorName(entry.actor, `deleted user (${entry.actorRole})`)}</span>
                  </span>
                  {entry.target && (
                    <span>
                      · On{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {actorName(entry.target, "user")} ({entry.target.role})
                      </span>
                    </span>
                  )}
                  {entry.ip && <span>· IP {entry.ip}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
