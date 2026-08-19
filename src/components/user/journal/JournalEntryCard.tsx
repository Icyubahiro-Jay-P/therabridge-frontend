import { Trash2, Edit3, MessageCircle, Globe, Lock } from "lucide-react"
import type { JournalEntry } from "./types"

const MOOD_EMOJI: Record<string, string> = {
  great: "\u{1F604}",
  good: "\u{1F642}",
  okay: "\u{1F610}",
  bad: "\u{1F61E}",
  terrible: "\u{1F622}",
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

interface JournalEntryCardProps {
  entry: JournalEntry
  onSelect: (id: string) => void
  onEdit: (entry: JournalEntry) => void
  onDelete: (id: string) => void
  currentUserId?: string
}

export function JournalEntryCard({ entry, onSelect, onEdit, onDelete, currentUserId }: JournalEntryCardProps) {
  const isOwner = entry.user === currentUserId

  return (
    <div
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900"
      onClick={() => onSelect(entry._id)}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {entry.mood && <span className="text-lg">{MOOD_EMOJI[entry.mood]}</span>}
          <h3 className="font-semibold text-gray-900 dark:text-white">{entry.title}</h3>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {entry.isPublic ? (
            <Globe className="size-3.5 text-blue-400" />
          ) : (
            <Lock className="size-3.5 text-gray-400" />
          )}
          {isOwner && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(entry) }}
                className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Edit3 className="size-3.5 text-gray-400" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(entry._id) }}
                className="rounded p-1 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <Trash2 className="size-3.5 text-red-400" />
              </button>
            </>
          )}
        </div>
      </div>

      <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
        {entry.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {entry.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            >
              {t}
            </span>
          ))}
          {entry.tags.length > 3 && (
            <span className="text-xs text-gray-400">+{entry.tags.length - 3}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {entry.comments.length > 0 && (
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3" />
              {entry.comments.length}
            </span>
          )}
          <span>{formatDate(entry.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
