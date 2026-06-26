import { useEffect, useState } from "react"
import { Loader2, Shield, Users, Hash, AlertTriangle } from "lucide-react"

import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"
import { AdminStatCard } from "./components/AdminStatCard"

export function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user)
  const [stats, setStats] = useState({ users: 0, therapists: 0, communities: 0, activeCrisis: 0, totalNotifications: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [usersRes, communitiesRes, crisisRes] = await Promise.all([
          api.get("/api/users/users"),
          api.get("/api/chat/communities"),
          api.get("/api/crisis/active").catch(() => ({ data: [] })),
        ])
        const allUsers = usersRes.data
        setStats({
          users: allUsers.filter((u: { role: string }) => u.role === "user").length,
          therapists: allUsers.filter((u: { role: string }) => u.role === "therapist").length,
          communities: communitiesRes.data.length,
          activeCrisis: crisisRes.data.length || 0,
          totalNotifications: 0,
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
    { label: "Users", value: stats.users, icon: Users, href: "/users", color: "bg-sky-500" },
    { label: "Therapists", value: stats.therapists, icon: Shield, href: "/users", color: "bg-emerald-500" },
    { label: "Communities", value: stats.communities, icon: Hash, href: "/communities", color: "bg-violet-500" },
    { label: "Active Crisis", value: stats.activeCrisis, icon: AlertTriangle, href: "/crisis", color: "bg-red-500" },
  ]

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Admin dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {user?.firstName}. Here is your platform overview.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <AdminStatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            href={card.href}
            color={card.color}
            isAlert={card.label === "Active Crisis"}
          />
        ))}
      </div>
    </div>
  )
}
