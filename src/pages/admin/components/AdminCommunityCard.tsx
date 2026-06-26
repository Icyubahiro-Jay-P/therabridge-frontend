import { Hash, Loader2, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminCommunity {
  _id: string
  name: string
  description: string
  inviteKey: string
  members: { _id: string; firstName: string; lastName: string }[]
  owner: { _id: string; firstName: string; lastName: string }
}

export function AdminCommunityCard({
  community,
  actionLoading,
  onDelete,
}: {
  community: AdminCommunity
  actionLoading: string | null
  onDelete: (id: string) => void
}) {
  return (
    <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
          <Hash className="size-5 text-emerald-600 dark:text-emerald-400" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900 dark:text-white">
            {community.name}
          </p>
          <p className="truncate text-xs text-gray-400">
            by {community.owner.firstName} {community.owner.lastName}
          </p>
        </div>
      </div>
      {community.description && (
        <p className="mt-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {community.description}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <Users className="size-3.5" />
        {community.members.length} member{community.members.length !== 1 ? "s" : ""}
        <span className="ml-auto font-mono">{community.inviteKey}</span>
      </div>
      <Button
        variant="ghost"
        size="xs"
        onClick={() => onDelete(community._id)}
        disabled={actionLoading === community._id}
        className="absolute top-3 right-3 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
      >
        {actionLoading === community._id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
      </Button>
    </div>
  )
}
