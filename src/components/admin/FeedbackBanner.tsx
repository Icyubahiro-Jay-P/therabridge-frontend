import { CheckCircle2, TriangleAlert } from "lucide-react"

export function FeedbackBanner({
  type,
  message,
}: {
  type: "error" | "success"
  message: string
}) {
  if (type === "error") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
        <TriangleAlert className="size-4 shrink-0" /> {message}
      </div>
    )
  }
  return (
    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
      <CheckCircle2 className="size-4 shrink-0" /> {message}
    </div>
  )
}
