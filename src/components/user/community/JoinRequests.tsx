import { Check, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "./Avatar"
import type { ChatUser } from "../chat/types"

export function JoinRequests({
  requests,
  busy,
  onApprove,
  onReject,
}: {
  requests: ChatUser[]
  busy: string | null
  onApprove: (userId: string) => void
  onReject: (userId: string) => void
}) {
  if (requests.length === 0) return null

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
      <h3 className="mb-3 text-sm font-semibold text-amber-900 dark:text-amber-300">
        Join requests ({requests.length})
      </h3>
      <div className="space-y-2">
        {requests.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2 dark:border-amber-900/50 dark:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              <Avatar user={user} size="sm" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-400">@{user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onApprove(user._id)}
                disabled={busy === user._id}
                className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              >
                {busy === user._id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Check className="size-3.5" />
                )}
                Approve
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onReject(user._id)}
                disabled={busy === user._id}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <X className="size-3.5" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
