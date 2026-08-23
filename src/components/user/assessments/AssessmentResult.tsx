import { ArrowLeft, Info } from "lucide-react"
import type { Assessment } from "@/lib/assessment-api"

const SEVERITY_DESCRIPTIONS: Record<string, string> = {
  minimal: "Your scores suggest minimal symptoms. Continue monitoring how you feel.",
  mild: "Your scores suggest mild symptoms. Consider self-help strategies and monitoring.",
  moderate: "Your scores suggest moderate symptoms. Consider speaking with a mental health professional.",
  moderately_severe: "Your scores suggest moderately severe symptoms. We recommend reaching out to a therapist.",
  severe: "Your scores suggest severe symptoms. Please consider reaching out to a mental health professional as soon as possible.",
}

const SEVERITY_BAR_COLORS: Record<string, string> = {
  minimal: "bg-emerald-500",
  mild: "bg-amber-400",
  moderate: "bg-amber-600",
  moderately_severe: "bg-red-500",
  severe: "bg-red-700",
}

interface AssessmentResultProps {
  result: Assessment
  onBack: () => void
}

export function AssessmentResult({ result, onBack }: AssessmentResultProps) {
  const percentage = result.maxScore > 0 ? (result.score / result.maxScore) * 100 : 0
  const severityDesc = SEVERITY_DESCRIPTIONS[result.severity] || ""

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        <ArrowLeft className="size-4" />
        Back to assessments
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{result.typeName}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Assessment completed</p>

        {/* Score Display */}
        <div className="mt-6 text-center">
          <div className="inline-flex size-28 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{result.score}</span>
            <span className="text-sm text-emerald-400">/{result.maxScore}</span>
          </div>
        </div>

        {/* Score Bar */}
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${SEVERITY_BAR_COLORS[result.severity] || "bg-gray-400"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Severity */}
        <div className="mt-4 text-center">
          <span className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${
            SEVERITY_BAR_COLORS[result.severity]?.replace("bg-", "bg-") + " text-white" || ""
          }`}>
            {result.severityLabel}
          </span>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {severityDesc}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-950/20">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            This is a screening tool, not a diagnosis. Results should be interpreted by a qualified mental health professional. If you are in crisis, please contact emergency services or a crisis hotline.
          </p>
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full rounded-xl border border-gray-200 py-2.5 text-sm text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        Back to Assessments
      </button>
    </div>
  )
}
