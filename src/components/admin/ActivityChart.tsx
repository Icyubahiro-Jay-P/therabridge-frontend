import { useState } from "react"
import { LineChart as LineChartIcon } from "lucide-react"
import type { DashboardActivityPoint } from "./dashboard-types"

const SERIES = [
  { key: "messages", label: "DMs", color: "#0f766e" },
  { key: "communityMessages", label: "Community", color: "#6b7280" },
  { key: "moods", label: "Mood logs", color: "#10b981" },
  { key: "exercises", label: "Exercises", color: "#f59e0b" },
  { key: "crises", label: "Crises", color: "#ef4444" },
  { key: "signups", label: "Signups", color: "#14b8a6" },
] as const

type SeriesKey = (typeof SERIES)[number]["key"]

const VIEWBOX = { width: 720, height: 280 }
const MARGIN = { top: 18, right: 16, bottom: 26, left: 38 }
const Y_TICKS = 4

function niceMax(max: number): number {
  if (max <= 5) return 5
  const pow = Math.pow(10, Math.floor(Math.log10(max)))
  const n = max / pow
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10
  return nice * pow
}

export function ActivityChart({ data }: { data: DashboardActivityPoint[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [hidden, setHidden] = useState<Set<SeriesKey>>(new Set())

  const visibleSeries = SERIES.filter((s) => !hidden.has(s.key))

  const n = data.length
  const hasActivity = data.some((point) =>
    SERIES.some((s) => point[s.key] > 0)
  )

  const maxVal = niceMax(
    Math.max(
      1,
      ...data.flatMap((point) => visibleSeries.map((s) => point[s.key]))
    )
  )
  const plotW = VIEWBOX.width - MARGIN.left - MARGIN.right
  const plotH = VIEWBOX.height - MARGIN.top - MARGIN.bottom
  const xStep = n > 1 ? plotW / (n - 1) : plotW
  const xFor = (i: number) => MARGIN.left + i * xStep
  const yFor = (value: number) =>
    MARGIN.top + plotH - (value / maxVal) * plotH

  const gridTicks = Array.from({ length: Y_TICKS + 1 }, (_, t) => ({
    value: (maxVal / Y_TICKS) * (Y_TICKS - t),
    y: yFor((maxVal / Y_TICKS) * (Y_TICKS - t)),
  }))

  function toggleSeries(key: SeriesKey) {
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function handleMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x =
      ((event.clientX - rect.left) / rect.width) * VIEWBOX.width
    const idx = Math.round((x - MARGIN.left) / xStep)
    setHoverIndex(Math.max(0, Math.min(n - 1, idx)))
  }

  const hovered = hoverIndex !== null ? data[hoverIndex] : null
  const tooltipLeft = (xFor(hoverIndex ?? 0) / VIEWBOX.width) * 100

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Platform activity
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last 14 days, across all users
          </p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <LineChartIcon className="size-4" />
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5 pb-4 text-xs">
        {SERIES.map((s) => {
          const isOff = hidden.has(s.key)
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={!isOff}
              title={isOff ? `Show ${s.label}` : `Hide ${s.label}`}
              onClick={() => toggleSeries(s.key)}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                isOff
                  ? "border-gray-200 text-gray-400 opacity-70 hover:opacity-100 dark:border-gray-700 dark:text-gray-500"
                  : "border-transparent text-gray-600 dark:text-gray-300"
              }`}
            >
              <span
                className="h-0.5 w-3 rounded-full transition-opacity"
                style={{
                  backgroundColor: isOff ? "#9ca3af" : s.color,
                  opacity: isOff ? 0.5 : 1,
                }}
              />
              {s.label}
            </button>
          )
        })}
      </div>

      {!hasActivity ? (
        <div className="flex h-52 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400 dark:border-gray-700">
          No activity recorded in the last 14 days.
        </div>
      ) : visibleSeries.length === 0 ? (
        <div className="flex h-52 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400 dark:border-gray-700">
          All series are hidden. Click a legend item to show it.
        </div>
      ) : (
        <div className="relative">
          <svg
            viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
            className="h-auto w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIndex(null)}
            role="img"
            aria-label="Platform activity line chart for the last 14 days"
          >
            <defs>
              {SERIES.map((s) => (
                <filter
                  key={s.key}
                  id={`glow-${s.key}`}
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="2"
                    floodColor={s.color}
                    floodOpacity="0.35"
                  />
                </filter>
              ))}
            </defs>

            {gridTicks.map((tick) => (
              <g key={tick.value}>
                <line
                  x1={MARGIN.left}
                  x2={VIEWBOX.width - MARGIN.right}
                  y1={tick.y}
                  y2={tick.y}
                  className="stroke-gray-100 dark:stroke-gray-800"
                  strokeWidth="1"
                />
                <text
                  x={MARGIN.left - 8}
                  y={tick.y + 3}
                  textAnchor="end"
                  className="fill-gray-400 dark:fill-gray-500"
                  style={{ fontSize: 10 }}
                >
                  {tick.value}
                </text>
              </g>
            ))}

            {data.map((point, i) => (
              <text
                key={point.date}
                x={xFor(i)}
                y={VIEWBOX.height - 8}
                textAnchor="middle"
                className="fill-gray-400 dark:fill-gray-500"
                style={{ fontSize: 10 }}
              >
                {point.label}
              </text>
            ))}

            {hoverIndex !== null && (
              <line
                x1={xFor(hoverIndex)}
                x2={xFor(hoverIndex)}
                y1={MARGIN.top}
                y2={MARGIN.top + plotH}
                className="stroke-gray-300 dark:stroke-gray-600"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            )}

            {visibleSeries.map((s) => {
              const points = data
                .map(
                  (point, i) =>
                    `${xFor(i)},${yFor(point[s.key])}`
                )
                .join(" ")
              return (
                <g key={s.key}>
                  <polyline
                    points={points}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.9}
                    filter={`url(#glow-${s.key})`}
                  />
                  {data.map((point, i) => {
                    const value = point[s.key]
                    const isHovered = hoverIndex === i
                    return (
                      <circle
                        key={point.date}
                        cx={xFor(i)}
                        cy={yFor(value)}
                        r={isHovered ? 4 : 2}
                        fill={s.color}
                        stroke="#fff"
                        strokeWidth={isHovered ? 1.5 : 0}
                        className="dark:stroke-gray-900"
                      />
                    )
                  })}
                </g>
              )
            })}
          </svg>

          {hovered && (
            <div
              className="pointer-events-none absolute -top-1 z-10 w-40 -translate-x-1/2"
              style={{
                left: `${tooltipLeft}%`,
                transform:
                  tooltipLeft < 14
                    ? "translateX(0)"
                    : tooltipLeft > 86
                      ? "translateX(-100%)"
                      : "translateX(-50%)",
              }}
            >
              <div className="rounded-xl border border-gray-200 bg-white/95 p-3 shadow-lg shadow-gray-200/60 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95 dark:shadow-black/40">
                <p className="mb-2 text-xs font-semibold text-gray-900 dark:text-white">
                  {hovered.label}
                </p>
                <ul className="space-y-1.5">
                  {visibleSeries.map((s) => (
                    <li
                      key={s.key}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                        {s.label}
                      </span>
                      <span className="font-medium text-gray-900 tabular-nums dark:text-white">
                        {hovered[s.key]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
