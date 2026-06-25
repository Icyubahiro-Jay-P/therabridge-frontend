import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ChevronRight,
  Loader2,
  Shield,
  Users,
  Hash,
} from "lucide-react"

import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface Stats {
  users: number
  therapists: number
  communities: number
}

export function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user)
  const [stats, setStats] = useState<Stats>({ users: 0, therapists: 0, communities: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [usersRes, communitiesRes] = await Promise.all([
          api.get("/api/users/users"),
          api.get("/api/chat/communities"),
        ])
        const allUsers = usersRes.data
        setStats({
          users: allUsers.filter((u: { role: string }) => u.role === "user").length,
          therapists: allUsers.filter((u: { role: string }) => u.role === "therapist").length,
          communities: communitiesRes.data.length,
        })
      } catch {} finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-gray-400" />
      </div>
    )
  }

  const cards = [
    { label: "Users", value: stats.users, icon: Users, href: "/admin/users", color: "bg-sky-500" },
    { label: "Therapists", value: stats.therapists, icon: Shield, href: "/admin/therapists", color: "bg-emerald-500" },
    { label: "Communities", value: stats.communities, icon: Hash, href: "/admin/communities", color: "bg-violet-500" },
  ]

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Admin dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {user?.firstName}. Here is your platform overview.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            to={href}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900"
          >
            <span className={cn("flex size-12 items-center justify-center rounded-xl text-white", color)}>
              <Icon className="size-6" />
            </span>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            </div>
            <ChevronRight className="ml-auto size-4 text-gray-300" />
          </Link>
        ))}
      </div>
    </div>
  )
}
