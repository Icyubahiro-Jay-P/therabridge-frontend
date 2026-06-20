import { cn } from "@/lib/utils"

type AuthFeedbackProps = {
  type: "success" | "error"
  message: string
}

export function AuthFeedback({ type, message }: AuthFeedbackProps) {
  const isError = type === "error"

  return (
    <p
      role="alert"
      className={cn(
        "rounded-2xl px-4 py-3 text-sm",
        isError
          ? "bg-destructive/10 text-destructive"
          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      )}
    >
      {message}
    </p>
  )
}
