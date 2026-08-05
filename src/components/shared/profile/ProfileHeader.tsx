import { User as UserIcon } from "lucide-react"
import AvatarActions from "@/components/user/shared/AvatarActions"
import type { PublicProfile } from "@/types/user"

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "")

export function ProfileHeader({ profile }: { profile: PublicProfile }) {
  const avatarUrl = profile.avatar
    ? profile.avatar.startsWith("http")
      ? profile.avatar
      : `${API_BASE_URL}${profile.avatar}`
    : ""

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
      <div className="relative shrink-0">
        <AvatarActions
          avatarUrl={avatarUrl}
          name={`${profile.firstName} ${profile.lastName}`}
        />
      </div>

      <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {profile.firstName || profile.lastName ? (
            <>
              {profile.firstName ?? ""} {profile.lastName ?? ""}
            </>
          ) : (
            <span className="flex items-center gap-2">
              <UserIcon className="size-5" /> Private Profile
            </span>
          )}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          @{profile.username}
        </p>
        {profile.bio ? (
          <p className="mt-2 max-w-lg text-sm text-gray-600 dark:text-gray-300">
            {profile.bio}
          </p>
        ) : profile.bio === null ? null : (
          <p className="mt-2 max-w-lg text-sm text-gray-400 italic">No bio</p>
        )}
      </div>
    </div>
  )
}
