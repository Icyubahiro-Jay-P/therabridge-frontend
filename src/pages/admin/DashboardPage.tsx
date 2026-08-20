import { useEffect, useState } from "react"
import {
  Loader2,
  Users,
  Shield,
  Hash,
  AlertTriangle,
  UserPlus,
  MessageCircle,
  Heart,
  Activity,
  RefreshCw,
  Plus,
} from "lucide-react"

import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"
import { AdminStatCard } from "@/components/admin/AdminStatCard"
import { PageHeader } from "@/components/admin/PageHeader"
import { FeedbackBanner } from "@/components/admin/FeedbackBanner"
import { ActivityChart } from "@/components/admin/ActivityChart"
import { MoodDistribution } from "@/components/admin/MoodDistribution"
import { ActiveCrises } from "@/components/admin/ActiveCrises"
import { RecentSignups } from "@/components/admin/RecentSignups"
import { TopCommunities } from "@/components/admin/TopCommunities"
import { RecentAudit } from "@/components/admin/RecentAudit"
import { CreateExerciseModal } from "@/components/admin/CreateExerciseModal"
import { StreakCards } from "@/components/user/home/StreakCards"
import type { AdminDashboardData } from "@/components/admin/dashboard-types"

interface ScoreStreak {
  exerciseScore: number
  loginStreak: number
  exerciseStreak: number
  longestLoginStreak: number
  longestExerciseStreak: number
}

const EMPTY_DATA: AdminDashboardData = {
  totals: { users: 0, therapists: 0, admins: 0, communities: 0, activeCrisis: 0, unverifiedUsers: 0, disabledUsers: 0, notifications: 0 },
  trends: { signupsToday: 0, signupsWeek: 0, signupsMonth: 0, communitiesWeek: 0, crisesWeek: 0, crisesMonth: 0, messagesWeek: 0, communityMessagesWeek: 0, moodsWeek: 0, exercisesWeek: 0 },
  activity: [],
  moodDistribution: { great: 0, good: 0, okay: 0, bad: 0, terrible: 0 },
  recentSignups: [],
  activeCrises: [],
  recentAudit: [],
  topCommunities: [],
}

export function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user)
  const [data, setData] = useState<AdminDashboardData>(EMPTY_DATA)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scoreStreak, setScoreStreak] = useState<ScoreStreak | null>(null)
  const [showCreateExercise, setShowCreateExercise] = useState(false)

  async function fetchDashboard(): Promise<AdminDashboardData> {
    const res = await api.get<AdminDashboardData>("/api/admin/dashboard")
    return res.data
  }

  useEffect(() => {
    let cancelled = false
    fetchDashboard()
      .then((dashboard) => {
        if (cancelled) return
        setData(dashboard)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load dashboard")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function handleRefresh() {
    setRefreshing(true)
    fetchDashboard()
      .then((dashboard) => {
        setData(dashboard)
        setError(null)
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load dashboard")
      )
      .finally(() => setRefreshing(false))
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-gray-400" />
      </div>
    )
  }

  const { totals, trends } = data

  const primaryCards = [
    {
      label: "Users",
      value: totals.users,
      icon: Users,
      href: "/users",
      color: "bg-sky-500",
      subtitle: `+${trends.signupsWeek} new this week`,
    },
    {
      label: "Therapists",
      value: totals.therapists,
      icon: Shield,
      href: "/users",
      color: "bg-emerald-500",
      subtitle: `${totals.unverifiedUsers} unverified accounts`,
    },
    {
      label: "Communities",
      value: totals.communities,
      icon: Hash,
      href: "/communities",
      color: "bg-violet-500",
      subtitle: `+${trends.communitiesWeek} created this week`,
    },
    {
      label: "Active Crisis",
      value: totals.activeCrisis,
      icon: AlertTriangle,
      href: "/crisis",
      color: "bg-red-500",
      isAlert: true,
      subtitle: `${trends.crisesWeek} alerts in the last 7 days`,
    },
  ]

  const weekCards = [
    { label: "New signups (7d)", value: trends.signupsWeek, icon: UserPlus, color: "bg-teal-500", href: "/users" },
    { label: "Direct messages (7d)", value: trends.messagesWeek, icon: MessageCircle, color: "bg-sky-500", href: "/users" },
    { label: "Mood check-ins (7d)", value: trends.moodsWeek, icon: Heart, color: "bg-emerald-500", href: "/users" },
    { label: "Exercises completed (7d)", value: trends.exercisesWeek, icon: Activity, color: "bg-amber-500", href: "/users" },
  ]

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Admin dashboard"
          description={`Welcome back, ${user?.firstName}. Here is how Therabridge is doing today.`}
        />
        <button
          type="button"
          onClick={() => handleRefresh()}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && <FeedbackBanner type="error" message={error} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {primaryCards.map((card) => (
          <AdminStatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            href={card.href}
            color={card.color}
            isAlert={card.isAlert}
            subtitle={card.subtitle}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {weekCards.map((card) => (
          <AdminStatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            href={card.href}
            color={card.color}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityChart data={data.activity} />
        </div>
        <MoodDistribution distribution={data.moodDistribution} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ActiveCrises crises={data.activeCrises} />
        <RecentSignups signups={data.recentSignups} />
        <TopCommunities communities={data.topCommunities} />
      </div>

      <RecentAudit entries={data.recentAudit} />
    </div>
  )
}
