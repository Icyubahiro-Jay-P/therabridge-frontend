import { BotIcon } from "lucide-react"

export function TherryHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-700/60">
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600">
        <BotIcon className="size-5 text-white" />
      </span>
      <div>
        <h1 className="font-semibold text-gray-900 dark:text-white">Therry</h1>
        <p className="text-xs text-gray-400">Your AI wellness companion</p>
      </div>
    </div>
  )
}
