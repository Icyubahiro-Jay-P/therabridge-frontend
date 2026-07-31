import { CheckCheck, PencilLine, Send, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ChatInput({
  value,
  loading,
  onChange,
  onSubmit,
  editing = false,
  onCancelEdit,
}: {
  value: string
  loading: boolean
  onChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  editing?: boolean
  onCancelEdit?: () => void
}) {
  return (
    <div className="border-t border-gray-200 px-4 py-3.5 dark:border-gray-700/60">
      {editing && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 dark:border-amber-700/70 dark:bg-amber-950/40">
          <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
            <PencilLine className="size-3.5" /> Editing message
          </p>
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/40"
          >
            <X className="size-3.5" /> Cancel
          </button>
        </div>
      )}
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={editing ? "Edit your message..." : "Share what's on your mind..."}
          disabled={loading}
          className={cn(
            "flex-1 rounded-xl",
            editing &&
              "border-amber-400 bg-amber-50/70 placeholder:text-amber-700/60 focus-visible:border-amber-500 focus-visible:ring-[3px] focus-visible:ring-amber-500/30 dark:border-amber-700 dark:bg-amber-950/30 dark:placeholder:text-amber-300/50"
          )}
        />
        <Button
          type="submit"
          disabled={loading || !value.trim()}
          className={cn(
            "shrink-0",
            editing ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"
          )}
          size="icon"
        >
          {editing ? <CheckCheck className="size-4" /> : <Send className="size-4" />}
        </Button>
      </form>
    </div>
  )
}
