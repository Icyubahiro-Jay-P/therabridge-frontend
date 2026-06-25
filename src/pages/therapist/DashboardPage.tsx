import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Hash,
  Loader2,
  MessageCircle,
  Users,
} from "lucide-react"

import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"

interface TherapistCommunity {
  _id: string
  name: string
  inviteKey: string
  members: { _id: string; firstName: string; lastName: string }[]
  description?: string
}

export function TherapistDashboardPage() {
  const user = useAuthStore((state) => state.user)
  const [communities, setCommunities] = useState<TherapistCommunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<TherapistCommunity[]>("/api/chat/communities")
        setCommunities(data)
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

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Therapist dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {user?.firstName}. Manage your communities and clients.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
          <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40">
            <Hash className="size-6" />
          </span>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{communities.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your communities</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
          <span className="flex size-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/40">
            <MessageCircle className="size-6" />
          </span>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {communities.reduce((sum, c) => sum + c.members.length, 0)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total members</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Your communities
        </h2>
        {communities.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Users className="size-12 text-gray-300" />
            <p className="text-sm text-gray-400">No communities yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((c) => (
              <Link
                key={c._id}
                to={`/community/${c.inviteKey}`}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                    <Hash className="size-5 text-emerald-600 dark:text-emerald-400" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900 dark:text-white">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {c.members.length} member{c.members.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                {c.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {c.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
