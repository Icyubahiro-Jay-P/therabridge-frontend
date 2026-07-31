import { useRef, useEffect } from "react"
import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MessageInput({
  value,
  onChange,
  onSend,
  sending,
  placeholder,
  enterToSend = true,
}: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  sending: boolean
  placeholder?: string
  enterToSend?: boolean
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
          placeholder={placeholder ?? "Type a message..."}
          disabled={sending}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-input bg-input/30 px-3 py-2 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
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
          className="mb-0.5 shrink-0 bg-emerald-600 hover:bg-emerald-700"
          size="icon"
        >
          {sending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </div>
  )
}
