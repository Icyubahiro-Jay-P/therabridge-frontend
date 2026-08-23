import { BookOpen, ChevronRight, CheckCircle2, Clock } from "lucide-react"
import { usePsychoedState } from "./usePsychoedState"
import { CATEGORY_META, type PsychoedCategory, type PsychoedModuleSummary } from "@/lib/psychoed-api"
import { useEffect, useRef } from "react"
import { PsychoedModuleDetail } from "./PsychoedModuleDetail"
import { EmptyState } from "@/components/user/shared/EmptyState"

const CATEGORY_ORDER: PsychoedCategory[] = ["cbt", "anxiety", "depression", "stress", "sleep", "relationships"]

const CATEGORY_BG: Record<PsychoedCategory, string> = {
  cbt: "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20",
  anxiety: "border-teal-200 bg-teal-50 dark:border-teal-900/50 dark:bg-teal-950/20",
  depression: "border-gray-200 bg-gray-50 dark:border-gray-900/50 dark:bg-gray-950/20",
  stress: "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20",
  sleep: "border-teal-200 bg-teal-50 dark:border-teal-900/50 dark:bg-teal-950/20",
  relationships: "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20",
}

const CATEGORY_DOT: Record<PsychoedCategory, string> = {
  cbt: "bg-emerald-500",
  anxiety: "bg-teal-500",
  depression: "bg-gray-500",
  stress: "bg-amber-500",
  sleep: "bg-teal-500",
  relationships: "bg-emerald-500",
}

const CATEGORY_ICON_COLOR: Record<PsychoedCategory, string> = {
  cbt: "text-emerald-600 dark:text-emerald-400",
  anxiety: "text-teal-600 dark:text-teal-400",
  depression: "text-gray-600 dark:text-gray-400",
  stress: "text-amber-600 dark:text-amber-400",
  sleep: "text-teal-600 dark:text-teal-400",
  relationships: "text-emerald-600 dark:text-emerald-400",
}

function ModuleCard({
  mod,
  onOpen,
}: {
  mod: PsychoedModuleSummary
  onOpen: (id: string) => void
}) {
  const meta = CATEGORY_META[mod.category]
  const progress = mod.progress
  const completedSteps = progress?.completedSteps.length ?? 0
  const isStarted = progress !== null
  const isCompleted = progress?.completed ?? false

  return (
    <button
      onClick={() => onOpen(mod._id)}
      className={`group w-full rounded-2xl border p-5 text-left transition-all duration-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${isCompleted ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/10" : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className={`inline-flex size-2 shrink-0 rounded-full ${CATEGORY_DOT[mod.category]}`} />
            <span className={`text-xs font-medium ${CATEGORY_ICON_COLOR[mod.category]}`}>
              {meta.label}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {mod.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
            {mod.description}
          </p>
        </div>
        <div className="shrink-0">
          {isCompleted ? (
            <CheckCircle2 className="size-5 text-emerald-500" />
          ) : isStarted ? (
            <Clock className="size-5 text-gray-400 dark:text-gray-500" />
          ) : (
            <ChevronRight className="size-5 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-400 dark:text-gray-600" />
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>{mod.stepCount} steps</span>
          {isStarted && (
            <span className={isCompleted ? "text-emerald-600 dark:text-emerald-400" : ""}>
              {isCompleted ? "Completed" : `${completedSteps}/${mod.stepCount}`}
            </span>
          )}
        </div>
        {isStarted && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isCompleted ? "bg-emerald-500" : "bg-gray-400 dark:bg-gray-500"}`}
              style={{ width: `${mod.stepCount > 0 ? (completedSteps / mod.stepCount) * 100 : 0}%` }}
            />
          </div>
        )}
      </div>
    </button>
  )
}

export function PsychoedPage() {
  const s = usePsychoedState()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      s.fetchModules()
    }
  })

  if (s.activeModule) {
    return (
      <PsychoedModuleDetail
        module={s.activeModule}
        progress={s.activeProgress}
        loading={s.loading}
        saving={s.saving}
        error={s.error}
        success={s.success}
        onBack={() => {
          s.clearMessages()
          s.fetchModules()
        }}
        onStart={s.startModule}
        onCompleteStep={s.completeStep}
        onNavigateToStep={s.navigateToStep}
        onClearMessages={s.clearMessages}
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Learn</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Interactive lessons on mental health concepts. Work at your own pace.
        </p>
      </div>

      {s.success && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
          {s.success}
        </div>
      )}

      {s.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {s.error}
        </div>
      )}

      {s.loading && s.modules.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORY_ORDER.map((cat) => {
            const catModules = s.modules.filter((m) => m.category === cat)
            if (catModules.length === 0) return null
            const meta = CATEGORY_META[cat]
            const completedCount = catModules.filter((m) => m.progress?.completed).length
            const startedCount = catModules.filter((m) => m.progress !== null).length

            return (
              <section key={cat}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex size-2.5 rounded-full ${CATEGORY_DOT[cat]}`} />
                    <h2 className={`text-sm font-semibold ${CATEGORY_ICON_COLOR[cat]}`}>
                      {meta.label}
                    </h2>
                  </div>
                  {startedCount > 0 && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {completedCount}/{catModules.length} completed
                    </span>
                  )}
                </div>
                <div className={`rounded-2xl border p-3 ${CATEGORY_BG[cat]}`}>
                  <div className="space-y-2">
                    {catModules.map((mod) => (
                      <ModuleCard
                        key={mod._id}
                        mod={mod}
                        onOpen={(id) => {
                          s.clearMessages()
                          s.fetchModule(id)
                        }}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      )}

      {!s.error && !s.loading && s.modules.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No learning modules yet"
          description="Learn is your self-guided psychoeducation library — short, interactive lessons on CBT, anxiety, low mood, stress and more. New modules are added by our care team, so check back soon."
        />
      )}
    </div>
  )
}
