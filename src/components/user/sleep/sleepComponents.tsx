import { Star } from "lucide-react"

export { formatDuration } from "./sleepUtils"

export function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-teal-600 text-white shadow-md shadow-teal-900/30"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

export function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className="group/Star focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          aria-label={`Quality ${s}`}
        >
          <Star
            className={`size-7 transition-colors ${
              s <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            } group-hover/Star:fill-amber-300 group-hover/Star:text-amber-300`}
          />
        </button>
      ))}
    </div>
  )
}

export function TrendChart({ data }: { data: { date: string; quality: number }[] }) {
  const maxQuality = 5
  const dayLabels = data.map((d) => {
    const dt = new Date(d.date + "T00:00:00")
    return dt.toLocaleDateString(undefined, { weekday: "short" })
  })

  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d, i) => {
        const pct = d.quality > 0 ? (d.quality / maxQuality) * 100 : 0
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
              {d.quality > 0 ? d.quality.toFixed(1) : "-"}
            </span>
            <div className="w-full flex items-end justify-center" style={{ height: "80px" }}>
              <div
                className="w-full max-w-8 rounded-t-lg transition-all duration-500 ease-out"
                style={{
                  height: `${Math.max(pct, 4)}%`,
                  backgroundColor:
                    d.quality === 0
                      ? "var(--color-border)"
                      : d.quality >= 4
                        ? "#059669"
                        : d.quality >= 3
                          ? "#10b981"
                          : d.quality >= 2
                            ? "#6ee7b7"
                            : "#a7f3d0",
                }}
              />
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {dayLabels[i]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
