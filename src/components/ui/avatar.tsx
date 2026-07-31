import * as React from "react"

import { cn } from "@/lib/utils"

function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<"img">) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
    "loading"
  )
  return (
    <img
      data-slot="avatar-image"
      onLoad={() => setStatus("loaded")}
      onError={() => setStatus("error")}
      className={cn(
        "aspect-square size-full object-cover",
        status !== "loaded" && "hidden",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
