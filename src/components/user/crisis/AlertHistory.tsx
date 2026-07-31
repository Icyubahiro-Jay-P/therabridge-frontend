import { Loader2, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface CrisisAlert {
  _id: string
  alertType: string
  status: string
  createdAt: string
}

export function AlertHistory({
  alerts,
  loading,
}: {
  alerts: CrisisAlert[]
  loading: boolean
}) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">My alerts</h2>
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-gray-400" /></div>
      ) : alerts.length === 0 ? (
        <p className="text-sm text-gray-400">No previous alerts.</p>
      ) : (
        <div className="space-y-2">
          {alerts.slice(0, 10).map((a) => (
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
          ))}
        </div>
      )}
    </div>
  )
}
