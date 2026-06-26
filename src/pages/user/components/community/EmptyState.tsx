import { Users } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
        <Users className="size-10 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Select a community
      </h3>
      <p className="max-w-xs text-sm text-gray-400">
        Choose a room from the sidebar or create one to start chatting.
      </p>
    </div>
  )
}
