import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const specialties = [
  "Anxiety", "Depression", "Stress", "Trauma", "Relationships", "Mindfulness",
]

export function TherapistSearchFilters({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string
  onSearchChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by name or specialty..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {specialties.map((s) => (
          <button
            key={s}
            onClick={() =>
              onSearchChange(
                searchQuery.toLowerCase() === s.toLowerCase() ? "" : s
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
  )
}
