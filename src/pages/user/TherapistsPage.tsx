import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Briefcase,
  Loader2,
  MessageCircle,
  Search,
  Star,
  TriangleAlert,
  User as UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface Therapist {
  _id: string
  username: string
  firstName: string
  lastName: string
  email: string
  bio?: string
  avatar?: string | null
  role: string
  createdAt?: string
}

const specialties = [
  "Anxiety",
  "Depression",
  "Stress",
  "Trauma",
  "Relationships",
  "Mindfulness",
]

export function TherapistsPage() {
  const navigate = useNavigate()

  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<Therapist[]>("/api/users/therapists")
        setTherapists(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load therapists")
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const filtered = therapists.filter((t) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      t.firstName.toLowerCase().includes(q) ||
      t.lastName.toLowerCase().includes(q) ||
      t.username.toLowerCase().includes(q) ||
      (t.bio && t.bio.toLowerCase().includes(q))
    )
  })

  function startChat(therapist: Therapist) {
    navigate(`/chat/${therapist.username}`)
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Therapists</h1>
        <p className="mt-2 text-muted-foreground">
          Connect with licensed therapists and wellness professionals.
        </p>
      </div>

      {/* Search + specialties */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {specialties.map((s) => (
            <button
              key={s}
              onClick={() =>
                setSearchQuery((prev) =>
                  prev.toLowerCase() === s.toLowerCase() ? "" : s
                )
              }
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                searchQuery.toLowerCase() === s.toLowerCase()
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" /> {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <UserIcon className="size-14 text-gray-300 dark:text-gray-600" />
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {searchQuery
                ? "No therapists match your search"
                : "No therapists available"}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {searchQuery
                ? "Try a different search term or specialty."
                : "Check back later for new therapists."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((therapist) => (
            <div
              key={therapist._id}
              className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900"
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                  <UserIcon className="size-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {therapist.firstName} {therapist.lastName}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <Briefcase className="size-3" /> Therapist
                  </p>
                </div>
              </div>

              {/* Rating area */}
              <div className="mt-4 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="ml-2 text-xs text-gray-400">5.0</span>
              </div>

              {/* Bio */}
              {therapist.bio && (
                <p className="mt-3 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                  {therapist.bio}
                </p>
              )}
              {!therapist.bio && (
                <p className="mt-3 text-sm italic text-gray-400">
                  No bio yet.
                </p>
              )}

              {/* Actions */}
              <div className="mt-4 flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <Button
                  size="sm"
                  onClick={() => startChat(therapist)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <MessageCircle className="size-3.5" /> Message
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/user/@${therapist.username}`)}
                >
                  View profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
