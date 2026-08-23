import { Zap, TrendingUp, Flame, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScoreStreak {
  exerciseScore: number
  loginStreak: number
  exerciseStreak: number
  longestLoginStreak: number
  longestExerciseStreak: number
}

interface Meta {
  fill: string
  next: number
  level?: number
  title?: string
}

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90, 180, 365]

function nextMilestone(value: number): Meta {
  const next = STREAK_MILESTONES.find((m) => m > value) ?? 365
  const prev = [...STREAK_MILESTONES].reverse().find((m) => m <= value) ?? 0
  const progress = next === prev ? 100 : ((value - prev) / (next - prev)) * 100
  return { next, fill: `${progress}%` }
}

function exLevel(score: number): Meta {
  if (score >= 1200) return { level: 7, title: "Voice of Therabridge", fill: "100%", next: 1200 }
  if (score >= 800) return { level: 6, title: "Connection Coach", fill: `${((score - 800) / 400) * 100}%`, next: 1200 }
  if (score >= 500) return { level: 5, title: "Heart of the Group", fill: `${((score - 500) / 300) * 100}%`, next: 800 }
  if (score >= 300) return { level: 4, title: "Storyteller", fill: `${((score - 300) / 200) * 100}%`, next: 500 }
  if (score >= 150) return { level: 3, title: "Conversationalist", fill: `${((score - 150) / 150) * 100}%`, next: 300 }
  if (score >= 50) return { level: 2, title: "Warming Up", fill: `${((score - 50) / 100) * 100}%`, next: 150 }
  return { level: 1, title: "First Step", fill: `${(score / 50) * 100}%`, next: 50 }
}

function streakLabel(value: number) {
  if (value === 0) return "Start your streak"
  if (value >= 365) return "Legendary"
  if (value >= 180) return "Phenomenal"
  if (value >= 90) return "Outstanding"
  if (value >= 60) return "Strong"
  if (value >= 30) return "Dedicated"
  if (value >= 14) return "Committed"
  if (value >= 7) return "On Fire"
  if (value >= 3) return "Getting Started"
  return "Just Beginning"
}

const cardStyle = { border: "border-gray-200/60 dark:border-gray-700/40", from: "from-gray-50", via: "via-gray-50/80", to: "to-gray-100/50", darkFrom: "dark:from-gray-900/40", darkVia: "dark:via-gray-900/30", darkTo: "dark:to-gray-950/20", iconBg: "bg-gray-100 dark:bg-gray-800/50", iconColor: "text-gray-600 dark:text-gray-400", textColor: "text-gray-700 dark:text-gray-300", labelColor: "text-gray-600 dark:text-gray-400", barBg: "bg-gray-200 dark:bg-gray-700/50", barFill: "bg-gray-500" }

export function StreakCards({ scoreStreak }: { scoreStreak: ScoreStreak }) {
  const best = Math.max(scoreStreak.longestLoginStreak, scoreStreak.longestExerciseStreak)

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Your Progress</h2>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          {exLevel(scoreStreak.exerciseScore).title}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {([
          { label: "Wellness Score", value: scoreStreak.exerciseScore, unit: "pts", Icon: Zap, meta: exLevel(scoreStreak.exerciseScore) },
          { label: "Exercise Streak", value: scoreStreak.exerciseStreak, unit: scoreStreak.exerciseStreak === 1 ? "day" : "days", Icon: TrendingUp, meta: nextMilestone(scoreStreak.exerciseStreak), tier: streakLabel(scoreStreak.exerciseStreak) },
          { label: "Login Streak", value: scoreStreak.loginStreak, unit: scoreStreak.loginStreak === 1 ? "day" : "days", Icon: Flame, meta: nextMilestone(scoreStreak.loginStreak), tier: streakLabel(scoreStreak.loginStreak) },
          { label: "Best Streak", value: best, unit: "days", Icon: Layers, meta: nextMilestone(best), tier: streakLabel(best) },
        ] as const).map((card) => {
          const s = cardStyle
          const meta = card.meta
          return (
            <div
              key={card.label}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg",
                "bg-linear-to-br",
                s.from, s.via, s.to,
                s.darkFrom, s.darkVia, s.darkTo,
                s.border,
              )}
            >
              <div className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full bg-white/40 dark:bg-white/5" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 size-20 rounded-full bg-white/30 dark:bg-white/5" />

              <div className="relative flex items-start justify-between">
                <div className={cn("flex size-10 items-center justify-center rounded-xl", s.iconBg)}>
                  <card.Icon className={cn("size-5", s.iconColor)} />
                </div>
              </div>

              <div className="relative mt-4">
                <p className={cn("text-xs font-medium tracking-wide uppercase", s.labelColor)}>
                  {card.label}
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className={cn("text-3xl font-bold tracking-tight", s.textColor)}>
                    {card.value}
                  </span>
                  <span className="text-sm text-gray-400 dark:text-gray-500">{card.unit}</span>
                </div>

                {meta.level !== undefined ? (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-500 dark:text-gray-400">
                        Lvl.{meta.level} {meta.title}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">
                        {scoreStreak.exerciseScore}/{meta.next} pts
                      </span>
                    </div>
                    <div className={cn("mt-1.5 h-2 overflow-hidden rounded-full", s.barBg)}>
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", s.barFill)}
                        style={{ width: meta.fill }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-500 dark:text-gray-400">
                        {"tier" in card ? card.tier : ""}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">
                        {card.value}/{meta.next} days
                      </span>
                    </div>
                    <div className={cn("mt-1.5 h-2 overflow-hidden rounded-full", s.barBg)}>
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", s.barFill)}
                        style={{ width: meta.fill }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
