import { ArrowLeft } from "lucide-react"
import type { AssessmentTrend } from "@/lib/assessment-api"

interface AssessmentTrendChartProps {
  trend: AssessmentTrend | null
  onBack: () => void
}

export function AssessmentTrendChart({ trend, onBack }: AssessmentTrendChartProps) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        <ArrowLeft className="size-4" />
        Back to assessments
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {trend?.typeName || "Assessment"}, Score Trend
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Last 6 months</p>

        {!trend || trend.trend.length === 0 ? (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No assessment history yet. Take your first assessment to start tracking.
          </div>
        ) : (
          <div className="mt-6">
            {/* Simple bar chart */}
            <div className="flex items-end gap-2" style={{ height: 160 }}>
              {trend.trend.map((point, i) => {
                const maxScore = trend.trend.reduce((max, p) => Math.max(max, p.score), 1)
                const height = (point.score / maxScore) * 140
                const severityColors: Record<string, string> = {
                  minimal: "bg-emerald-400",
                  mild: "bg-amber-400",
                  moderate: "bg-amber-600",
                  moderately_severe: "bg-red-400",
                  severe: "bg-red-600",
                }
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                      {point.score}
                    </span>
                    <div
                      className={`w-full rounded-t-md ${severityColors[point.severity] || "bg-gray-400"}`}
                      style={{ height: Math.max(height, 4) }}
                    />
                    <span className="text-[9px] text-gray-400">
                      {new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3">
              {["minimal", "mild", "moderate", "moderately_severe", "severe"].map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className={`size-2.5 rounded-full ${
                    s === "minimal" ? "bg-emerald-400" :
                    s === "mild" ? "bg-amber-400" :
                    s === "moderate" ? "bg-amber-600" :
                    s === "moderately_severe" ? "bg-red-400" : "bg-red-600"
                  }`} />
                  <span className="text-[10px] capitalize text-gray-500 dark:text-gray-400">
                    {s.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
