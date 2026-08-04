import { Ban, Loader2, ShieldOff, Trash2, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AppUser {
  _id: string
  username: string
  firstName: string
  lastName: string
  email: string
  role: string
  isDisabled?: boolean
  therapist?: { _id: string; firstName: string; lastName: string; username: string } | null
}

interface TherapistOption {
  _id: string
  firstName: string
  lastName: string
  username: string
}

export function AdminUserRow({
  user,
  therapists,
  actionLoading,
  onToggleDisable,
  onChangeRole,
  onAssignTherapist,
  onDelete,
}: {
  user: AppUser
  therapists: TherapistOption[]
  actionLoading: string | null
  onToggleDisable: (id: string) => void
  onChangeRole: (id: string, role: string) => void
  onAssignTherapist: (id: string, therapistId: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 sm:gap-4 sm:px-5",
        user.isDisabled && "opacity-50"
      )}
    >
      <div className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full",
        user.isDisabled ? "bg-gray-200 text-gray-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800"
      )}>
        <UserIcon className="size-5" />
      </div>
      <div className="min-w-0 flex-1 basis-32">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {user.firstName} {user.lastName}
          {user.isDisabled && <span className="ml-2 text-xs text-red-500">(Disabled)</span>}
        </p>
        <p className="truncate text-xs text-gray-400">@{user.username} · {user.email}</p>
      </div>

      {user.role === "user" && (
        <select
          value={user.therapist?._id ?? ""}
          onChange={(e) => onAssignTherapist(user._id, e.target.value)}
          disabled={actionLoading === user._id}
          className="max-w-40 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:border-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          title="Assign a therapist who manages this user"
        >
          <option value="">No therapist</option>
          {therapists.map((t) => (
            <option key={t._id} value={t._id}>
              {t.firstName} {t.lastName}
            </option>
          ))}
        </select>
      )}

      <select
        value={user.role}
        onChange={(e) => onChangeRole(user._id, e.target.value)}
        disabled={actionLoading === user._id}
        className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:border-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
        <option value="user">User</option>
        <option value="therapist">Therapist</option>
        <option value="admin">Admin</option>
      </select>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onToggleDisable(user._id)}
          disabled={actionLoading === user._id}
          className={cn(
            "text-xs",
            user.isDisabled ? "text-emerald-500 hover:bg-emerald-50" : "text-amber-500 hover:bg-amber-50"
          )}
          title={user.isDisabled ? "Enable account" : "Disable account"}
        >
          {actionLoading === user._id ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : user.isDisabled ? (
            <ShieldOff className="size-3.5" />
          ) : (
            <Ban className="size-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onDelete(user._id)}
          disabled={actionLoading === user._id || user.role === "admin"}
          className="text-red-500 hover:bg-red-50 disabled:opacity-30"
          title="Delete user"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
