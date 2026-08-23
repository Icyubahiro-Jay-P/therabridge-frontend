import { useState } from "react"
import { UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatUser } from "../chat/types"

export function Avatar({
  user,
  size = "md",
  fallbackClassName,
}: {
  user: ChatUser
  size?: "sm" | "md"
  fallbackClassName?: string
}) {
  const [imgError, setImgError] = useState(false)
  const baseUrl: string =
    import.meta.env.VITE_API_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  const avatarUrl = user.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${baseUrl}${user.avatar}`
    : null

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={`${user.firstName} ${user.lastName}`}
        onError={() => setImgError(true)}
        className={cn(
          "shrink-0 rounded-full object-cover",
          size === "sm" ? "size-8" : "size-10"
        )}
      />
    )
  }

  const colors = [
    "bg-emerald-500",
    "bg-teal-500",
    "bg-amber-500",
    "bg-emerald-600",
    "bg-teal-600",
    "bg-gray-500",
  ]
  const color = colors[user.username.charCodeAt(0) % colors.length]

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-white",
        fallbackClassName ?? color,
        size === "sm" ? "size-8" : "size-10"
      )}
    >
      <UserCircle
        className={size === "sm" ? "size-6" : "size-7"}
        strokeWidth={1.75}
      />
    </span>
  )
}
