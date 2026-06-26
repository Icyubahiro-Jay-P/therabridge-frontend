import { User as UserIcon } from "lucide-react"

export function TherapistsEmptyState({
  searchQuery,
}: {
  searchQuery: string
}) {
  return (
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
  )
}
