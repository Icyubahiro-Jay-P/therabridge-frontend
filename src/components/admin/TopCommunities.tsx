import { Link } from "react-router-dom"
import { Users, MessageSquareText, Lock } from "lucide-react"
import type { DashboardCommunity } from "./dashboard-types"

export function TopCommunities({
  communities,
}: {
  communities: DashboardCommunity[]
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top communities
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Most active rooms on the platform
          </p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <Users className="size-4" />
        </span>
      </div>

      {communities.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          No communities yet.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {communities.map((c) => (
            <li key={c._id}>
              <Link
                to="/communities"
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {c.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium text-gray-900 dark:text-white">
                    {c.name}
                    {c.isPrivate && (
                      <Lock className="size-3 shrink-0 text-gray-400" />
                    )}
                  </p>
                  <p className="truncate text-xs capitalize text-gray-400">
                    {c.category}
                  </p>
                </div>
                <div className="shrink-0 space-y-0.5 text-right text-xs text-gray-500 dark:text-gray-400">
                  <p className="flex items-center justify-end gap-1">
                    <Users className="size-3" /> {c.memberCount}
                  </p>
                  <p className="flex items-center justify-end gap-1">
                    <MessageSquareText className="size-3" /> {c.messageCount}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
