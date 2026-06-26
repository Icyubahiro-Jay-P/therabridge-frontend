import { cn } from "@/lib/utils"

const alertTypes = [
  { value: "immediate_danger", label: "Immediate Danger", color: "bg-red-500", severity: "Critical" },
  { value: "severe_distress", label: "Severe Distress", color: "bg-orange-500", severity: "High" },
  { value: "panic_attack", label: "Panic Attack", color: "bg-amber-500", severity: "Medium" },
  { value: "self_harm_thoughts", label: "Self-Harm Thoughts", color: "bg-red-600", severity: "Critical" },
  { value: "emergency", label: "Emergency", color: "bg-red-700", severity: "Emergency" },
]

export function AlertTypeSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="mb-4 space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">What are you experiencing?</p>
      {alertTypes.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
            value === t.value
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
  )
}
