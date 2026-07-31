import { Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ChatInput({
  value,
  loading,
  onChange,
  onSubmit,
}: {
  value: string
  loading: boolean
  onChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <div className="border-t border-gray-200 px-4 py-3.5 dark:border-gray-700/60">
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Share what's on your mind..."
          disabled={loading}
          className="flex-1 rounded-xl"
        />
        <Button type="submit" disabled={loading || !value.trim()} className="shrink-0 bg-emerald-600 hover:bg-emerald-700" size="icon">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
