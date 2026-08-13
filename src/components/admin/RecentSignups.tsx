import { Link } from "react-router-dom"
import { UserPlus, CheckCircle2, ShieldCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { DashboardSignup } from "./dashboard-types"

function initials(first: string, last: string) {
  return `${(first?.[0] ?? "").toUpperCase()}${(last?.[0] ?? "").toUpperCase()}`
}

export function RecentSignups({ signups }: { signups: DashboardSignup[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent signups
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Newest accounts on the platform
          </p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <UserPlus className="size-4" />
        </span>
      </div>

      {signups.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          No signups yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {signups.map((u) => (
            <li key={u._id}>
              <Link
                to={`/users`}
                className="flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
              >
                <Avatar className="size-9">
                  {u.avatar ? <AvatarImage src={u.avatar} alt={u.username} /> : null}
                  <AvatarFallback className="bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {initials(u.firstName, u.lastName) || "@"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium text-gray-900 dark:text-white">
                    {u.firstName} {u.lastName}
                    {u.isAccountVerified ? (
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                    ) : (
                      <span
                        className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                        title="Email not verified"
                      >
                        unverified
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-gray-400">@{u.username}</p>
                </div>
                <div className="text-right">
                  {u.role === "therapist" && (
                    <p className="flex items-center justify-end gap-1 text-[10px] font-medium text-violet-500">
                      <ShieldCheck className="size-3" /> therapist
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
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
