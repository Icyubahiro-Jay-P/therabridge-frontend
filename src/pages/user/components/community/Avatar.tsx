import { useState } from "react"
import { cn } from "@/lib/utils"
import type { ChatUser } from "../chat/types"

export function Avatar({
  user,
  size = "md",
}: {
  user: ChatUser
  size?: "sm" | "md"
}) {
  const [imgError, setImgError] = useState(false)
  const avatarUrl = user.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `http://localhost:5000${user.avatar}`
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

  const initials = (user.firstName[0] ?? "") + (user.lastName[0] ?? "")
  const colors = [
    "bg-emerald-500",
    "bg-teal-500",
    "bg-sky-500",
    "bg-violet-500",
    "bg-pink-500",
    "bg-orange-500",
  ]
  const color = colors[user.username.charCodeAt(0) % colors.length]

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        color,
        size === "sm" ? "size-8 text-xs" : "size-10 text-sm"
      )}
    >
      {initials.toUpperCase()}
    </span>
  )
}
