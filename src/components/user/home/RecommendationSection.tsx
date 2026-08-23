import { useState } from "react"
import {
  Wind,
  Brain,
  CalendarCheck,
  Pencil,
  Activity,
  Play,
  Heart,
  Moon,
  ClipboardCheck,
  CalendarPlus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { recommendationApi, type Recommendation } from "@/lib/recommendation-api"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wind,
  Brain,
  CalendarCheck,
  Pencil,
  Activity,
  Play,
  Heart,
  Moon,
  ClipboardCheck,
  CalendarPlus,
  Sparkles,
}

function RecommendationIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] || Sparkles
  return <Icon className={className} />
}

const PRIORITY_STYLES: Record<string, { badge: string; ring: string }> = {
  high: {
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    ring: "ring-amber-500/20",
  },
  medium: {
    badge: "bg-amber-600/15 text-amber-700 dark:bg-amber-600/25 dark:text-amber-500",
    ring: "ring-amber-600/25",
  },
  low: {
    badge: "bg-amber-300/30 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400",
    ring: "ring-amber-400/20",
  },
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-amber-200/60 bg-amber-50/50 p-5 dark:border-amber-800/30 dark:bg-amber-950/20">
      <div className="flex items-start gap-4">
        <div className="size-10 shrink-0 rounded-xl bg-amber-200/60 dark:bg-amber-800/30" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-amber-200/60 dark:bg-amber-800/30" />
          <div className="h-3 w-full rounded bg-amber-100 dark:bg-amber-900/30" />
          <div className="h-3 w-4/5 rounded bg-amber-100 dark:bg-amber-900/30" />
        </div>
      </div>
    </div>
  )
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const styles = PRIORITY_STYLES[rec.priority] || PRIORITY_STYLES.medium

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
        "border-amber-200/60 bg-linear-to-br from-amber-50 via-amber-50/30 to-amber-100/50",
        "dark:border-amber-800/30 dark:from-amber-950/30 dark:via-amber-950/20 dark:to-amber-900/20",
        "hover:shadow-lg hover:shadow-amber-500/5",
        styles.ring,
      )}
    >
      <div className="pointer-events-none absolute -top-6 -right-6 size-20 rounded-full bg-amber-100/40 dark:bg-amber-900/20" />

      <div className="relative flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
          <RecommendationIcon name={rec.icon} className="size-5 text-amber-600 dark:text-amber-400" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {rec.title}
            </h3>
            <span
              className={cn(
                "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                styles.badge,
              )}
            >
              {rec.priority}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {rec.description}
          </p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
          >
            {expanded ? "Hide reason" : "Why this?"}
            {expanded ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
          </button>

          {expanded && (
            <div className="mt-2 rounded-lg bg-amber-100/60 p-3 text-xs leading-relaxed text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              {rec.reason}
            </div>
          )}

          <button
            onClick={() => navigate(rec.actionUrl)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-600 active:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500"
          >
            Go there
            <ArrowRight className="size-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function RecommendationSection() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendations = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await recommendationApi.get()
      setRecommendations(data)
      setFetched(true)
    } catch {
      setError("Could not load recommendations. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recommended for You
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Personalized suggestions based on your recent activity
          </p>
        </div>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
          {error}
        </div>
      )}

      {!loading && !error && fetched && recommendations.length === 0 && (
        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-6 text-center dark:border-amber-800/30 dark:bg-amber-950/20">
          <Sparkles className="mx-auto size-8 text-amber-400 dark:text-amber-500" />
          <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            All clear! No recommendations right now.
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Keep up your routine and check back later.
          </p>
        </div>
      )}

      {!loading && !error && fetched && recommendations.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.id} rec={rec} />
          ))}
        </div>
      )}

      {!fetched && !loading && (
        <button
          onClick={fetchRecommendations}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-medium text-amber-700 transition-all hover:bg-amber-100 hover:shadow-md hover:shadow-amber-500/10 active:bg-amber-200 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-900/40"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          Get Recommendations
        </button>
      )}
    </section>
  )
}
