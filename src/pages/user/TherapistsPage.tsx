import { useState } from "react"
import { TriangleAlert } from "lucide-react"

import { useGetTherapists } from "@/lib/query-hooks"
import { TherapistSearchFilters } from "@/components/user/therapists/TherapistSearchFilters"
import { TherapistCard } from "@/components/user/therapists/TherapistCard"
import { TherapistsEmptyState } from "@/components/user/therapists/TherapistsEmptyState"
import { Skeleton } from "@/components/ui/skeleton"

interface Therapist {
  _id: string
  username: string
  firstName: string
  lastName: string
  email: string
  bio?: string
  role: string
}

function TherapistCardSkeleton() {
  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function TherapistsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data, isLoading, isError, error } = useGetTherapists(1, 50)

  const therapists: Therapist[] = data?.data ?? []
  const filtered = therapists.filter((t) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      t.firstName.toLowerCase().includes(q) ||
      t.lastName.toLowerCase().includes(q) ||
      t.username.toLowerCase().includes(q) ||
      !!t.bio?.toLowerCase().includes(q)
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

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <TherapistCardSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" />
          {error instanceof Error ? error.message : "Failed to load therapists"}
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
