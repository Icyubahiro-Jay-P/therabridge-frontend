import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, BookOpen } from "lucide-react"
import { CATEGORY_META } from "@/lib/psychoed-api"
import type { PsychoedModuleDetail as ModuleDetail, PsychoedProgress, PsychoedCategory } from "@/lib/psychoed-api"

const CATEGORY_ACCENT: Record<PsychoedCategory, { bg: string; text: string; lightBg: string }> = {
  cbt: { bg: "bg-emerald-600", text: "text-emerald-600 dark:text-emerald-400", lightBg: "bg-emerald-50 dark:bg-emerald-950/20" },
  anxiety: { bg: "bg-teal-600", text: "text-teal-600 dark:text-teal-400", lightBg: "bg-teal-50 dark:bg-teal-950/20" },
  depression: { bg: "bg-gray-600", text: "text-gray-600 dark:text-gray-400", lightBg: "bg-gray-50 dark:bg-gray-950/20" },
  stress: { bg: "bg-amber-600", text: "text-amber-600 dark:text-amber-400", lightBg: "bg-amber-50 dark:bg-amber-950/20" },
  sleep: { bg: "bg-teal-600", text: "text-teal-600 dark:text-teal-400", lightBg: "bg-teal-50 dark:bg-teal-950/20" },
  relationships: { bg: "bg-emerald-600", text: "text-emerald-600 dark:text-emerald-400", lightBg: "bg-emerald-50 dark:bg-emerald-950/20" },
}

function renderMarkdown(text: string) {
  const lines = text.split("\n")
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <h3 key={i} className="mb-2 mt-5 text-sm font-bold text-gray-900 dark:text-white">
          {line.slice(2, -2)}
        </h3>,
      )
      i++
      continue
    }

    if (line.startsWith("- ")) {
      const items: React.ReactNode[] = []
      while (i < lines.length && lines[i].startsWith("- ")) {
        const content = lines[i].slice(2)
        const parts = content.split(/\*\*(.*?)\*\*/g)
        items.push(
          <li key={i} className="flex gap-2 py-1">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-gray-400 dark:bg-gray-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {parts.map((part, pi) =>
                pi % 2 === 1 ? (
                  <strong key={pi} className="font-semibold text-gray-900 dark:text-white">{part}</strong>
                ) : (
                  <span key={pi}>{part}</span>
                ),
              )}
            </span>
          </li>,
        )
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-2 space-y-1 pl-1">
          {items}
        </ul>,
      )
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      const items: React.ReactNode[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        const content = lines[i].replace(/^\d+\.\s/, "")
        const parts = content.split(/\*\*(.*?)\*\*/g)
        items.push(
          <li key={i} className="flex gap-3 py-1">
            <span className="mt-0.5 text-xs font-bold text-gray-400 dark:text-gray-500">{items.length + 1}.</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {parts.map((part, pi) =>
                pi % 2 === 1 ? (
                  <strong key={pi} className="font-semibold text-gray-900 dark:text-white">{part}</strong>
                ) : (
                  <span key={pi}>{part}</span>
                ),
              )}
            </span>
          </li>,
        )
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-2 space-y-1 pl-1">
          {items}
        </ol>,
      )
      continue
    }

    if (line === "") {
      elements.push(<div key={i} className="h-2" />)
      i++
      continue
    }

    const parts = line.split(/\*\*(.*?)\*\*/g)
    elements.push(
      <p key={i} className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {parts.map((part, pi) =>
          pi % 2 === 1 ? (
            <strong key={pi} className="font-semibold text-gray-900 dark:text-white">{part}</strong>
          ) : (
            <span key={pi}>{part}</span>
          ),
        )}
      </p>,
    )
    i++
  }

  return elements
}

interface Props {
  module: ModuleDetail
  progress: PsychoedProgress | null
  loading: boolean
  saving: boolean
  error: string | null
  success: string | null
  onBack: () => void
  onStart: (id: string) => Promise<PsychoedProgress | null>
  onCompleteStep: (id: string, stepIndex: number) => Promise<PsychoedProgress | null>
  onNavigateToStep: (stepIndex: number) => void
  onClearMessages: () => void
}

export function PsychoedModuleDetail({
  module: mod,
  progress,
  loading: _loading,
  saving,
  error,
  success,
  onBack,
  onStart,
  onCompleteStep,
  onNavigateToStep,
  onClearMessages,
}: Props) {
  const accent = CATEGORY_ACCENT[mod.category]
  const meta = CATEGORY_META[mod.category]
  const currentStep = progress?.currentStepIndex ?? 0
  const step = mod.steps[currentStep]
  const totalSteps = mod.steps.length
  const completedSteps = progress?.completedSteps.length ?? 0
  const isCompleted = progress?.completed ?? false
  const stepCompleted = progress?.completedSteps.includes(currentStep) ?? false

  const handleNext = async () => {
    if (!stepCompleted) {
      await onCompleteStep(mod._id, currentStep)
    }
    if (currentStep < totalSteps - 1) {
      onNavigateToStep(currentStep + 1)
    }
    onClearMessages()
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      onNavigateToStep(currentStep - 1)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={onBack}
          className="mt-1 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className={`text-xs font-medium ${accent.text}`}>{meta.label}</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{mod.title}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{mod.description}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          {success}
        </div>
      )}

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span>
            {completedSteps}/{totalSteps} complete
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isCompleted ? "bg-emerald-500" : "bg-gray-400 dark:bg-gray-500"}`}
            style={{ width: `${totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-1.5">
        {mod.steps.map((s, i) => {
          const done = progress?.completedSteps.includes(i) ?? false
          const active = i === currentStep
          return (
            <button
              key={i}
              onClick={() => {
                if (i <= currentStep || done) onNavigateToStep(i)
              }}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                active
                  ? accent.bg
                  : done
                    ? "bg-emerald-400 dark:bg-emerald-500"
                    : "bg-gray-200 dark:bg-gray-700"
              } ${i <= currentStep || done ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
              title={s.title}
            />
          )
        })}
      </div>

      {/* Step content */}
      {!progress && !isCompleted ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-col items-center py-6 text-center">
            <BookOpen className="mb-4 size-10 text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mod.steps.length} steps to complete this module.
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Estimated {mod.steps.reduce((a, s) => a + s.duration, 0)} minutes total.
            </p>
            <button
              onClick={() => onStart(mod._id)}
              disabled={saving}
              className={`mt-6 rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-colors ${accent.bg} hover:opacity-90 disabled:opacity-50`}
            >
              {saving ? "Starting..." : "Start Module"}
            </button>
          </div>
        </div>
      ) : isCompleted ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <CheckCircle2 className="mx-auto mb-4 size-12 text-emerald-500" />
          <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">Module Complete</h2>
          <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
            You've finished all {totalSteps} steps. Great work on your learning journey.
          </p>
          <button
            onClick={onBack}
            className="mt-6 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Back to Modules
          </button>
        </div>
      ) : step ? (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          {/* Step header */}
          <div className={`rounded-t-2xl px-6 py-4 ${accent.lightBg}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {step.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {step.duration} min
                </span>
                {stepCompleted && (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                )}
              </div>
            </div>
          </div>

          {/* Step body */}
          <div className="px-6 py-5">
            <div className="space-y-3">
              {renderMarkdown(step.content)}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 dark:border-gray-800">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0 || saving}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="size-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {!stepCompleted ? (
                <button
                  onClick={handleNext}
                  disabled={saving}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-colors ${accent.bg} hover:opacity-90 disabled:opacity-50`}
                >
                  {saving ? "Saving..." : currentStep === totalSteps - 1 ? "Complete Module" : "Mark Complete"}
                </button>
              ) : currentStep < totalSteps - 1 ? (
                <button
                  onClick={() => onNavigateToStep(currentStep + 1)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-colors ${accent.bg} hover:opacity-90`}
                >
                  Next Step
                  <ChevronRight className="ml-1 inline size-3.5" />
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                  All steps complete
                </span>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
