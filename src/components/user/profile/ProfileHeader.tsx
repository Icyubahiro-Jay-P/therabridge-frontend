import { Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "./types"
import type { User } from "@/types/user"

interface Props {
  user: User
  avatarUrl: string
  onCameraClick: () => void
  children?: React.ReactNode
}

export function ProfileHeader({ user, avatarUrl, onCameraClick, children }: Props) {
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
      <div className="relative shrink-0">
        <Avatar className="size-24 border-2 border-gray-200 shadow-sm dark:border-gray-700">
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback className="bg-emerald-100 text-lg font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>
        <button
          onClick={onCameraClick}
          className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow hover:bg-emerald-600 dark:border-gray-900"
        >
          <Camera className="size-3.5" />
        </button>
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
