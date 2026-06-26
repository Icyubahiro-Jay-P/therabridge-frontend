import { AlertTriangle } from "lucide-react"

export function CrisisHeader() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
        <AlertTriangle className="size-6 text-red-600 dark:text-red-400" />
      </span>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crisis Support</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">If you're in immediate danger, call 911 right away.</p>
      </div>
    </div>
  )
}
