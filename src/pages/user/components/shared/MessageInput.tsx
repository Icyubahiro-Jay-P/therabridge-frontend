import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
  return (
    <div className="border-t border-gray-200 px-4 py-3.5 dark:border-gray-700/60">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSend()
        }}
        className="flex items-center gap-2"
      >
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Type a message..."}
          disabled={sending}
          className="flex-1 rounded-xl"
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
          className="shrink-0 bg-emerald-600 hover:bg-emerald-700"
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
