import AvatarActions from "@/components/user/shared/AvatarActions"
import type { User } from "@/types/user"

interface Props {
  user: User
  avatarUrl: string
  onCameraClick: () => void
  onRemove?: () => Promise<void>
  children?: React.ReactNode
}

export function ProfileHeader({
  user,
  avatarUrl,
  onCameraClick,
  onRemove,
  children,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
      <div className="relative shrink-0">
        <AvatarActions
          avatarUrl={avatarUrl || ""}
          name={`${user.firstName} ${user.lastName}`}
          isOwner
          onUpdate={onCameraClick}
          onRemove={onRemove}
        />
        {children}
      </div>

      <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          @{user.username}
        </p>
        {user.bio && (
          <p className="mt-2 max-w-lg text-sm text-gray-600 dark:text-gray-300">
            {user.bio}
          </p>
        )}
      </div>
    </div>
  )
}
