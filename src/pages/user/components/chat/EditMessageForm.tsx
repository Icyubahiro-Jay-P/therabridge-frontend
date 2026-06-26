import { CheckCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EditMessageForm({
  content,
  onChange,
  onSave,
  onCancel,
}: {
  content: string
  onChange: (v: string) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="px-3.5 pt-2.5 pb-2">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-lg border border-emerald-400 bg-white/90 p-2 text-sm text-gray-900 outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-100"
        rows={2}
        autoFocus
      />
      <div className="mt-2 flex justify-end gap-1.5">
        <Button size="sm" variant="ghost" onClick={onCancel} className="h-7 px-2 text-xs text-white hover:bg-white/20">
          <X className="size-3" /> Cancel
        </Button>
        <Button size="sm" onClick={onSave} disabled={!content.trim()} className="h-7 bg-white px-2 text-xs text-emerald-700 hover:bg-emerald-50">
          <CheckCheck className="size-3" /> Save
        </Button>
      </div>
    </div>
  )
}
