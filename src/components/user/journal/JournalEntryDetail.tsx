import { useState } from "react"
import { ArrowLeft, Trash2, Edit3, Globe, Lock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { JournalEntry } from "./types"

const MOOD_EMOJI: Record<string, string> = {
  great: "\u{1F604}",
  good: "\u{1F642}",
  okay: "\u{1F610}",
  bad: "\u{1F61E}",
  terrible: "\u{1F622}",
}

const MOOD_LABEL: Record<string, string> = {
  great: "Great",
  good: "Good",
  okay: "Okay",
  bad: "Bad",
  terrible: "Terrible",
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

interface JournalEntryDetailProps {
  entry: JournalEntry
  currentUserId?: string
  onBack: () => void
  onEdit: (entry: JournalEntry) => void
  onDelete: (id: string) => void
  onAddComment: (entryId: string, content: string) => Promise<void>
  onDeleteComment: (entryId: string, commentId: string) => Promise<void>
}

export function JournalEntryDetail({
  entry,
  currentUserId,
  onBack,
  onEdit,
  onDelete,
  onAddComment,
  onDeleteComment,
}: JournalEntryDetailProps) {
  const [commentText, setCommentText] = useState("")
  const [posting, setPosting] = useState(false)
  const isOwner = entry.user === currentUserId

  const handlePostComment = async () => {
    if (!commentText.trim() || posting) return
    setPosting(true)
    try {
      await onAddComment(entry._id, commentText.trim())
      setCommentText("")
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-700/60">
        <button onClick={onBack} className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft className="size-4 text-gray-500" />
        </button>
        <div className="flex-1" />
        {isOwner && (
          <>
            <button onClick={() => onEdit(entry)} className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Edit3 className="size-4 text-gray-400" />
            </button>
            <button onClick={() => onDelete(entry._id)} className="rounded-lg p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40">
              <Trash2 className="size-4 text-red-400" />
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            {entry.mood && (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-sm dark:bg-gray-800">
                {MOOD_EMOJI[entry.mood]} {MOOD_LABEL[entry.mood]}
              </span>
            )}
            {entry.isPublic ? (
              <span className="flex items-center gap-1 text-xs text-emerald-500"><Globe className="size-3" /> Public</span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-gray-400"><Lock className="size-3" /> Private</span>
            )}
          </div>

          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{entry.title}</h1>
          <p className="mb-4 text-xs text-gray-400">{formatDateTime(entry.createdAt)}</p>

          {entry.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-1.5">
              {entry.tags.map((t) => (
                <span key={t} className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-gray max-w-none whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            {entry.content}
          </div>

          {/* Comments */}
          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700/60">
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Comments ({entry.comments.length})
            </h3>

            <div className="space-y-3">
              {entry.comments.map((c) => (
                <div key={c._id} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {c.author.firstName} {c.author.lastName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{formatDateTime(c.createdAt)}</span>
                      {(c.author._id === currentUserId || isOwner) && (
                        <button
                          onClick={() => onDeleteComment(entry._id, c._id)}
                          className="rounded p-0.5 hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <Trash2 className="size-3 text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{c.content}</p>
                </div>
              ))}
            </div>

            {/* Add comment */}
            <div className="mt-4 flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                placeholder="Add a comment..."
                maxLength={1000}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <Button
                onClick={handlePostComment}
                disabled={!commentText.trim() || posting}
                size="sm"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
