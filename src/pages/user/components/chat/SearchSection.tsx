import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { Avatar } from "./Avatar"
import type { ChatUser } from "./types"

export function SearchSection({
  searchQuery,
  setSearchQuery,
  searching,
  searchResults,
  onSelectUser,
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
  searching: boolean
  searchResults: ChatUser[]
  onSelectUser: (user: ChatUser) => void
}) {
  return (
    <>
      <div className="p-3">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>
      {searchQuery.length >= 2 && (
        <div className="border-b border-gray-200 dark:border-gray-700/60">
          <p className="px-3 py-1.5 text-xs font-medium tracking-wider text-gray-400 uppercase">
            Search results
          </p>
          {searching ? (
            <div className="flex justify-center py-4">
              <Loader2 className="size-5 animate-spin text-gray-400" />
            </div>
          ) : searchResults.length === 0 ? (
            <p className="px-3 py-3 text-sm text-gray-400">No users found</p>
          ) : (
            searchResults.map((u) => (
              <button
                key={u._id}
                onClick={() => onSelectUser(u)}
                className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Avatar user={u} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="truncate text-xs text-gray-400">@{u.username}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </>
  )
}
