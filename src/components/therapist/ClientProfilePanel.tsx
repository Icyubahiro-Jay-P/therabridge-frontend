import { EyeOff, Loader2, X } from "lucide-react"

interface FullUserData {
  _id: string
  username: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  bio: string
  role: string
  createdAt: string
  exerciseScore: number
  exerciseStreak: number
}

export function ClientProfilePanel({
  loading,
  error,
  user,
  onClose,
}: {
  loading: boolean
  error: string | null
  user: FullUserData | null
  onClose: () => void
}) {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-red-500">{error}</div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <div>
          <EyeOff className="mx-auto size-8 text-gray-300" />
          <p className="mt-2 text-sm text-gray-400">Select a client to view their full profile</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Client profile</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="size-4" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-600 dark:bg-emerald-900/40">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-400">@{user.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
            <p className="text-xs text-gray-400">Email</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
            <p className="text-xs text-gray-400">Date of Birth</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
            <p className="text-xs text-gray-400">Role</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{user.role}</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
            <p className="text-xs text-gray-400">Member since</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
            <p className="text-xs text-gray-400">EX Score</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.exerciseScore || 0}</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
            <p className="text-xs text-gray-400">Streak</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.exerciseStreak || 0} days</p>
          </div>
        </div>

        {user.bio && (
          <div>
            <p className="mb-1 text-xs text-gray-400">Bio</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{user.bio}</p>
          </div>
        )}
      </div>
    </div>
  )
}
