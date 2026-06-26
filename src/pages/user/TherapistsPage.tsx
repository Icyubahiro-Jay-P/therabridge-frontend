import { useEffect, useState } from "react"
import { Loader2, TriangleAlert } from "lucide-react"

import { api } from "@/lib/api"
import { TherapistSearchFilters } from "./components/therapists/TherapistSearchFilters"
import { TherapistCard } from "./components/therapists/TherapistCard"
import { TherapistsEmptyState } from "./components/therapists/TherapistsEmptyState"

interface Therapist {
  _id: string
  username: string
  firstName: string
  lastName: string
  email: string
  bio?: string
  role: string
}

export function TherapistsPage() {
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

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Therapists</h1>
        <p className="mt-2 text-muted-foreground">
          Connect with licensed therapists and wellness professionals.
        </p>
      </div>

      <TherapistSearchFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" /> {error}
        </div>
      ) : filtered.length === 0 ? (
        <TherapistsEmptyState searchQuery={searchQuery} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((therapist) => (
            <TherapistCard key={therapist._id} therapist={therapist} />
          ))}
        </div>
      )}
    </div>
  )
}
