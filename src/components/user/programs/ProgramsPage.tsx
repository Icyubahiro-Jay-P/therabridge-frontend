import { Route, BookOpen, CheckCircle2, ArrowRight, Clock, Sparkles } from "lucide-react"
import { useProgramState } from "./useProgramState"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { ProgramListItem } from "@/lib/program-api"

const CATEGORY_TABS = [
  { key: undefined, label: "All" },
  { key: "anxiety", label: "Anxiety" },
  { key: "mood", label: "Mood" },
  { key: "stress", label: "Stress" },
  { key: "sleep", label: "Sleep" },
  { key: "resilience", label: "Resilience" },
] as const

const CATEGORY_COLORS: Record<string, string> = {
  anxiety: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  mood: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
  stress: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  sleep: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",
  resilience: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
}

function ProgramCard({
  program,
  onPress,
}: {
  program: ProgramListItem
  onPress: () => void
}) {
  const hasStarted = !!program.progress
  const isCompleted = program.progress?.completed ?? false
  const percentage = program.progress?.percentage ?? 0

  return (
    <button
      onClick={onPress}
      className="group w-full text-left rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-emerald-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[program.category] ?? ""}`}
            >
              {program.category}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
                <CheckCircle2 className="size-3" />
                Done
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            {program.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {program.description}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {program.duration}
            </span>
            <span>{program.totalWeeks} weeks</span>
            <span>{program.totalActivities} activities</span>
          </div>
        </div>
        <ArrowRight className="mt-1 size-5 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-500 dark:text-gray-600" />
      </div>

      {hasStarted && !isCompleted && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              Week {(program.progress?.currentWeek ?? 0) + 1} of {program.totalWeeks}
            </span>
            <span>{percentage}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      {!hasStarted && (
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <BookOpen className="size-4" />
          Start program
        </div>
      )}
    </button>
  )
}

export function ProgramsPage() {
  const p = useProgramState()
  const navigate = useNavigate()
  const initializedRef = useRef(false)
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined)
  const [view, setView] = useState<"browse" | "my">("browse")

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      p.fetchPrograms()
      p.fetchMyPrograms()
    }
  })

  useEffect(() => {
    p.fetchPrograms(activeTab)
  }, [activeTab])

  const myPrograms = [...p.myInProgress, ...p.myCompleted]

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Route className="size-6 text-emerald-600" />
          Programs
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Structured therapeutic journeys for skill-building and growth.
        </p>
      </div>

      {p.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {p.error}
        </div>
      )}
      {p.success && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
          {p.success}
        </div>
      )}

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("browse")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            view === "browse"
              ? "bg-emerald-600 text-white"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          }`}
        >
          <BookOpen className="mr-1 inline size-3.5" />
          Browse
        </button>
        <button
          onClick={() => setView("my")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            view === "my"
              ? "bg-emerald-600 text-white"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          }`}
        >
          <Sparkles className="mr-1 inline size-3.5" />
          My Programs ({myPrograms.length})
        </button>
      </div>

      {view === "browse" && (
        <>
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.key ?? "all"}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-emerald-600 text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Program List */}
          {p.loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-2 h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-2 h-4 w-72 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          ) : p.programs.length === 0 ? (
            activeTab ? (
              <EmptyState
                icon={Route}
                title="Nothing in this category yet"
                description="There are no programs under this category right now. Try another category or check back soon."
              />
            ) : (
              <EmptyState
                icon={Route}
                title="No programs available yet"
                description="Programs are structured, multi-week therapeutic journeys created by our care team. New ones are added regularly — check back soon."
              />
            )
          ) : (
            <div className="space-y-3">
              {p.programs.map((program) => (
                <ProgramCard
                  key={program._id}
                  program={program}
                  onPress={() => navigate(`/programs/${program._id}`)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {view === "my" && (
        <>
          {p.loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-2 h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          ) : myPrograms.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="You haven&apos;t started any programs yet"
              description="Pick a program that fits what you're working on and complete short activities each week. Your progress will be tracked here."
              action={
                <button
                  onClick={() => setView("browse")}
                  className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Browse programs
                </button>
              }
            />
          ) : (
            <div className="space-y-3">
              {myPrograms.map((program) => (
                <ProgramCard
                  key={program._id}
                  program={program}
                  onPress={() => navigate(`/programs/${program._id}`)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
