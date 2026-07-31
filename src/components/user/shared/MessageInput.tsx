import { useRef, useEffect } from "react"
import { CheckCheck, Loader2, PencilLine, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MessageInput({
  value,
  onChange,
  onSend,
  sending,
  placeholder,
  enterToSend = true,
  editing = false,
  onCancelEdit,
}: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  sending: boolean
  placeholder?: string
  enterToSend?: boolean
  editing?: boolean
  onCancelEdit?: () => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }
  }, [value])

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
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSend()
        }}
        className="flex items-end gap-2"
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={editing ? "Edit your message..." : (placeholder ?? "Type a message...")}
          disabled={sending}
          rows={1}
          className={cn(
            "flex-1 resize-none rounded-xl border px-3 py-2 text-base outline-none transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&::-webkit-scrollbar]:hidden [scrollbar-width:none]",
            editing
              ? "border-amber-400 bg-amber-50/70 placeholder:text-amber-700/60 focus-visible:border-amber-500 focus-visible:ring-[3px] focus-visible:ring-amber-500/30 dark:border-amber-700 dark:bg-amber-950/30 dark:placeholder:text-amber-300/50"
              : "border-input bg-input/30 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          )}
          onKeyDown={(e) => {
            if (enterToSend && e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              onSend()
            }
            if (!enterToSend && e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              onSend()
            }
          }}
        />
        <Button
          type="submit"
          disabled={sending || !value.trim()}
          className={cn(
            "mb-0.5 shrink-0",
            editing
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-emerald-600 hover:bg-emerald-700"
          )}
          size="icon"
        >
          {sending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : editing ? (
            <CheckCheck className="size-4" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </div>
  )
}
