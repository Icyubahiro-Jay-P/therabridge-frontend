import { Edit, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function MessageActions({
  isMe,
  editAllowed,
  onEdit,
  onUnsend,
  onClose,
  deleting,
}: {
  isMe: boolean
  editAllowed: boolean
  onEdit: () => void
  onUnsend: () => void
  onClose: () => void
  deleting: boolean
}) {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div
        className={cn(
          "absolute z-20 min-w-[120px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800",
          isMe ? "right-8" : "left-8"
        )}
      >
        {editAllowed && (
          <button
            onClick={onEdit}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Edit className="size-3" /> Edit
          </button>
        )}
        <button
          onClick={onUnsend}
          disabled={deleting}
          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <X className="size-3" /> Unsend
        </button>
      </div>
    </>
  )
}
