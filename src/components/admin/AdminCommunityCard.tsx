import { Hash, Loader2, Lock, ShieldOff, ShieldCheck, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdminCommunity {
  _id: string
  name: string
  description: string
  inviteKey: string
  members: { _id: string; firstName: string; lastName: string }[]
  owner: { _id: string; firstName: string; lastName: string }
  category?: string
  isPrivate?: boolean
  isDisabled?: boolean
}

export function AdminCommunityCard({
  community,
  actionLoading,
  onDelete,
  onToggleDisable,
}: {
  community: AdminCommunity
  actionLoading: string | null
  onDelete: () => void
  onToggleDisable: (id: string) => void
}) {
  const busy = actionLoading === community._id

  return (
    <div className={cn(
      "relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm dark:bg-gray-900",
      community.isDisabled
        ? "border-red-200 opacity-70 dark:border-red-900/50"
        : "border-gray-200 dark:border-gray-700/60"
    )}>
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
        {community.isPrivate && <Lock className="size-3.5" />}
        {community.isDisabled && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
            Disabled
          </span>
        )}
        {community.category && community.category !== "general" && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] capitalize dark:bg-gray-800">
            {community.category}
          </span>
        )}
        <span className="ml-auto font-mono">{community.inviteKey}</span>
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onToggleDisable(community._id)}
          disabled={busy}
          className={cn(
            "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
            community.isDisabled
              ? "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30"
              : "text-amber-500 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/30"
          )}
          title={community.isDisabled ? "Enable community" : "Disable community"}
        >
          {busy ? <Loader2 className="size-3.5 animate-spin" /> : community.isDisabled ? <ShieldCheck className="size-3.5" /> : <ShieldOff className="size-3.5" />}
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={onDelete}
          disabled={busy}
          className="text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
