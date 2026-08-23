import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { ASSESSMENT_QUESTIONS, RESPONSE_OPTIONS } from "@/lib/assessment-api"

interface AssessmentQuestionnaireProps {
  type: string
  onComplete: (responses: { questionIndex: number; value: number }[]) => void
  onCancel: () => void
  saving: boolean
}

export function AssessmentQuestionnaire({ type, onComplete, onCancel, saving }: AssessmentQuestionnaireProps) {
  const config = ASSESSMENT_QUESTIONS[type]
  const [currentQ, setCurrentQ] = useState(0)
  const [responses, setResponses] = useState<Record<number, number>>({})

  if (!config) return null

  const questions = config.questions
  const progress = ((currentQ + 1) / questions.length) * 100
  const currentResponse = responses[currentQ]

  const selectResponse = (value: number) => {
    setResponses((prev) => ({ ...prev, [currentQ]: value }))
  }

  const canProceed = currentResponse !== undefined
  const isLast = currentQ === questions.length - 1

  const handleSubmit = () => {
    const responseArray = questions.map((_, i) => ({
      questionIndex: i,
      value: responses[i] ?? 0,
    }))
    onComplete(responseArray)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          <ArrowLeft className="size-4" />
          Cancel
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {currentQ + 1} of {questions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{config.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{config.description}</p>
      </div>

      {/* Question */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Over the last 2 weeks, how often have you been bothered by:
        </p>
        <p className="mt-3 text-base font-semibold text-gray-900 dark:text-white">
          {questions[currentQ]}
        </p>
      </div>

      {/* Response Options */}
      <div className="space-y-2">
        {RESPONSE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => selectResponse(option.value)}
            className={`w-full rounded-xl border p-4 text-left transition-colors ${
              currentResponse === option.value
                ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40"
                : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm ${currentResponse === option.value ? "font-medium text-emerald-700 dark:text-emerald-300" : "text-gray-700 dark:text-gray-300"}`}>
                {option.label}
              </span>
              <div className={`size-5 rounded-full border-2 ${
                currentResponse === option.value
                  ? "border-emerald-600 bg-emerald-600"
                  : "border-gray-300 dark:border-gray-600"
              }`}>
                {currentResponse === option.value && (
                  <div className="flex size-full items-center justify-center">
                    <div className="size-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)}
          disabled={currentQ === 0}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Previous
        </button>
        {isLast ? (
          <button
            onClick={handleSubmit}
            disabled={!canProceed || saving}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "Scoring..." : "Complete Assessment"}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQ(currentQ + 1)}
            disabled={!canProceed}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
