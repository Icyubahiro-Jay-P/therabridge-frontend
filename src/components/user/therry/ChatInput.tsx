import { useRef } from "react"
import { CheckCheck, PencilLine, Send, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CharCounter } from "@/components/ui/char-counter"
import { useMessageAutoFocus } from "@/hooks/useMessageAutoFocus"
import { cn } from "@/lib/utils"
import { LIMITS } from "@/lib/limits"

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
  const maxLength = LIMITS.message.therry
  const inputRef = useRef<HTMLInputElement>(null)
  useMessageAutoFocus(inputRef, { value, disabled: loading })
  return (
    <div className="border-t border-gray-200 px-4 py-3.5 dark:border-gray-700/60">
      {editing && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-teal-300 bg-teal-50 px-3 py-2 dark:border-teal-700/70 dark:bg-teal-950/40">
          <p className="flex items-center gap-1.5 text-xs font-medium text-teal-700 dark:text-teal-300">
            <PencilLine className="size-3.5" /> Editing message
          </p>
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100 dark:text-teal-300 dark:hover:bg-teal-900/40"
          >
            <X className="size-3.5" /> Cancel
          </button>
        </div>
      )}
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder={editing ? "Edit your message..." : "Share what's on your mind..."}
          disabled={loading}
          maxLength={maxLength}
          aria-label="Message to Therry"
          className={cn(
            "flex-1 rounded-xl",
            editing &&
              "border-teal-400 bg-teal-50/70 placeholder:text-teal-700/60 focus-visible:border-teal-500 focus-visible:ring-[3px] focus-visible:ring-teal-500/30 dark:border-teal-700 dark:bg-teal-950/30 dark:placeholder:text-teal-300/50"
          )}
        />
        <Button
          type="submit"
          disabled={loading || !value.trim()}
          className={cn(
            "shrink-0",
            editing ? "bg-teal-600 hover:bg-teal-700" : "bg-emerald-600 hover:bg-emerald-700"
          )}
          size="icon"
        >
          {editing ? <CheckCheck className="size-4" /> : <Send className="size-4" />}
        </Button>
      </form>
      <div className="mt-1.5 flex justify-end">
        <CharCounter count={value.length} limit={maxLength} />
      </div>
    </div>
  )
}
