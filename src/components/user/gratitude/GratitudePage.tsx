import { Sparkles, Flame, BookOpen, Send } from "lucide-react"
import { useGratitudeState } from "./useGratitudeState"
import { useEffect, useRef, useState } from "react"

export function GratitudePage() {
  const g = useGratitudeState()
  const initializedRef = useRef(false)
  const [content, setContent] = useState("")

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      g.fetchPrompt()
      g.fetchEntries()
      g.fetchStreak()
    }
  })

  const handleSubmit = async () => {
    if (!content.trim()) return
    const result = await g.createEntry(content.trim())
    if (result) {
      setContent("")
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gratitude Journal</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Daily gratitude practice for better well-being.
        </p>
      </div>

      {g.success && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
          {g.success}
        </div>
      )}

      {g.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {g.error}
        </div>
      )}

      {/* Streak & Stats */}
      {g.streak && (
        <div className="flex gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 dark:border-orange-900/50 dark:bg-orange-950/30">
            <Flame className="size-5 text-orange-500" />
            <div>
              <p className="text-lg font-bold text-orange-700 dark:text-orange-400">{g.streak.streak}</p>
              <p className="text-xs text-orange-600 dark:text-orange-500">day streak</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
            <BookOpen className="size-5 text-gray-400" />
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{g.streak.totalEntries}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">total entries</p>
            </div>
          </div>
        </div>
      )}

      {/* Today's Prompt */}
      {g.prompt && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6 dark:border-violet-900/50 dark:bg-violet-950/30">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-violet-600 dark:text-violet-400" />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Today's Prompt
              </p>
              <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                {g.prompt.text}
              </p>
            </div>
          </div>

          {g.hasEntryToday ? (
            <div className="mt-4 rounded-xl bg-white/60 px-4 py-3 text-sm text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
              You've completed today's gratitude prompt! Come back tomorrow for a new one.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={1000}
                rows={4}
                className="w-full rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:border-violet-800 dark:bg-gray-900 dark:text-white"
                placeholder="Write what you're grateful for..."
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{content.length}/1000</span>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || g.saving}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  <Send className="size-3.5" />
                  {g.saving ? "Saving..." : "Log Gratitude"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Past Entries */}
      {g.entries.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Past Entries</h2>
          <div className="space-y-3">
            {g.entries.map((entry) => (
              <div
                key={entry._id}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <p className="text-xs font-medium text-violet-600 dark:text-violet-400">
                  {entry.promptText}
                </p>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{entry.content}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => g.deleteEntry(entry._id)}
                    className="text-xs text-gray-300 hover:text-red-500 dark:text-gray-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {g.entries.length === 0 && !g.loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Sparkles className="mb-4 size-12 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">No gratitude entries yet.</p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Start your daily gratitude practice above.
          </p>
        </div>
      )}
    </div>
  )
}
