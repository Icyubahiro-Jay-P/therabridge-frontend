import { Link } from "react-router-dom"
import { ScrollText } from "lucide-react"
import type { DashboardAuditEntry } from "./dashboard-types"

const ACTION_LABELS: Record<string, string> = {
  user_profile_view: "User profile viewed",
  client_roster_view: "Client roster viewed",
  crisis_view: "Crisis data viewed",
  safety_plan_view: "Safety plan viewed",
  safety_plan_update: "Safety plan updated",
  risk_summary_view: "Risk summary viewed",
  data_export: "Data exported",
  account_deletion: "Account deleted",
  ai_disclosure_ack: "AI disclosure acknowledged",
}

function actorName(
  actor: DashboardAuditEntry["actor"],
  actorRole: string
): string {
  if (!actor) return `Deleted user (${actorRole})`
  return `${actor.firstName} ${actor.lastName ?? ""}`.trim() || actor.username
}

export function RecentAudit({ entries }: { entries: DashboardAuditEntry[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent privacy activity
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Latest events from the audit log
          </p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <ScrollText className="size-4" />
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          No audit events recorded yet.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {entries.map((entry) => (
            <li key={entry._id} className="py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {ACTION_LABELS[entry.action] ?? entry.action.replace(/_/g, " ")}
                </p>
                <span className="shrink-0 text-[11px] text-gray-400">
                  {new Date(entry.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                By {actorName(entry.actor, entry.actorRole)}
                {entry.target
                  ? ` · On ${entry.target.firstName} ${entry.target.lastName ?? ""}`.trim()
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/audit"
        className="mt-4 block text-center text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
      >
        Open full audit log
      </Link>
    </div>
  )
}
