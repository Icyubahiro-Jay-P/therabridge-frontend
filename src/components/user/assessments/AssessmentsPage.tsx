import { ClipboardCheck, TrendingDown, TrendingUp, ChevronRight, Trash2 } from "lucide-react"
import { useAssessmentState } from "./useAssessmentState"
import { AssessmentQuestionnaire } from "./AssessmentQuestionnaire"
import { AssessmentResult } from "./AssessmentResult"
import { AssessmentTrendChart } from "./AssessmentTrendChart"
import { useEffect, useRef, useState } from "react"
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment-api"
import type { Assessment } from "@/lib/assessment-api"

const SEVERITY_COLORS: Record<string, string> = {
  minimal: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  mild: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
  moderate: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  moderately_severe: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  severe: "bg-red-200 text-red-800 dark:bg-red-950/60 dark:text-red-300",
}

export function AssessmentsPage() {
  const a = useAssessmentState()
  const initializedRef = useRef(false)
  const [activeView, setActiveView] = useState<"list" | "take" | "result" | "trend">("list")
  const [selectedType, setSelectedType] = useState<string | null>(null)

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      a.fetchAssessments()
    }
  })

  const startAssessment = (type: string) => {
    setSelectedType(type)
    setActiveView("take")
    a.clearLastResult()
  }

  const handleComplete = async (type: string, responses: { questionIndex: number; value: number }[]) => {
    const result = await a.takeAssessment(type, responses)
    if (result) {
      setActiveView("result")
    }
  }

  const viewTrend = (type: string) => {
    setSelectedType(type)
    a.fetchTrend(type)
    setActiveView("trend")
  }

  if (activeView === "take" && selectedType) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <AssessmentQuestionnaire
          type={selectedType}
          onComplete={(responses) => handleComplete(selectedType, responses)}
          onCancel={() => setActiveView("list")}
          saving={a.saving}
        />
      </div>
    )
  }

  if (activeView === "result" && a.lastResult) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <AssessmentResult
          result={a.lastResult}
          onBack={() => { a.clearLastResult(); setActiveView("list") }}
        />
      </div>
    )
  }

  if (activeView === "trend" && selectedType) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <AssessmentTrendChart
          trend={a.trend}
          onBack={() => setActiveView("list")}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clinical Assessments</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Validated screening tools to help you understand your mental health.
        </p>
      </div>

      {a.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {a.error}
        </div>
      )}

      {/* Assessment Types */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(ASSESSMENT_QUESTIONS).map(([type, config]) => (
          <div
            key={type}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{config.title}</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{config.description}</p>
                <p className="mt-2 text-xs text-gray-400">{config.questions.length} questions</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => startAssessment(type)}
                className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
              >
                <ClipboardCheck className="size-3.5" />
                Take Now
              </button>
              <button
                onClick={() => viewTrend(type)}
                className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                View Trend
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Assessments */}
      {a.assessments.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Recent Results</h2>
          <div className="space-y-2">
            {a.assessments.slice(0, 10).map((assessment) => (
              <div
                key={assessment._id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {assessment.typeName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(assessment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {assessment.score}/{assessment.maxScore}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_COLORS[assessment.severity] ?? ""}`}>
                    {assessment.severityLabel}
                  </span>
                  <button
                    onClick={() => a.deleteAssessment(assessment._id)}
                    className="rounded-lg p-1 text-gray-300 hover:text-red-500 dark:text-gray-600"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {a.assessments.length === 0 && !a.loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ClipboardCheck className="mb-4 size-12 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">No assessments taken yet.</p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Take a screening to understand your current mental health.
          </p>
        </div>
      )}
    </div>
  )
}
