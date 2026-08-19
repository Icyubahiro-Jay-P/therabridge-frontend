import { useCallbackRef } from "@/hooks/useCallbackRef"
import { TriangleAlert, Plus, Search, BookOpen } from "lucide-react"
import { useJournalState } from "./useJournalState"
import { JournalEditor } from "./JournalEditor"
import { JournalEntryCard } from "./JournalEntryCard"
import { JournalEntryDetail } from "./JournalEntryDetail"
import { useAuthStore } from "@/store/auth-store"

export function JournalPage() {
  const j = useJournalState()
  const currentUser = useAuthStore((s) => s.user)

  // Trigger initial fetch on mount
  const mountedRef = useCallbackRef(() => {
    j.fetchEntries({ page: 1, mood: null, search: "" })
  })

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6" ref={mountedRef}>
      {j.selectedEntry ? (
        <JournalEntryDetail
          entry={j.selectedEntry}
          currentUserId={currentUser?.id}
          onBack={() => j.setSelectedEntry(null)}
          onEdit={j.openEditor}
          onDelete={j.removeEntry}
          onAddComment={j.addCommentToEntry}
          onDeleteComment={j.removeCommentFromEntry}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Journal</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Write freely, reflect often.</p>
            </div>
            <button
              onClick={() => j.openEditor()}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="size-4" />
              New Entry
            </button>
          </div>

          {j.success && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
              {j.success}
            </div>
          )}

          {/* Search & Filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={j.searchQuery}
                onChange={(e) => {
                  j.setSearchQuery(e.target.value)
                  j.fetchEntries({ page: 1, mood: j.filterMood, search: e.target.value })
                }}
                placeholder="Search entries..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <select
              value={j.filterMood ?? ""}
              onChange={(e) => {
                const v = e.target.value || null
                j.setFilterMood(v)
                j.fetchEntries({ page: 1, mood: v, search: j.searchQuery })
              }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              <option value="">All moods</option>
              <option value="great">Great</option>
              <option value="good">Good</option>
              <option value="okay">Okay</option>
              <option value="bad">Bad</option>
              <option value="terrible">Terrible</option>
            </select>
          </div>

          {j.loadError && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              <TriangleAlert className="size-4 shrink-0" />
              {j.loadError}
            </div>
          )}

          {/* Entry list */}
          <div className="space-y-3">
            {j.entries.map((entry) => (
              <JournalEntryCard
                key={entry._id}
                entry={entry}
                onSelect={j.openEntry}
                onEdit={j.openEditor}
                onDelete={j.removeEntry}
                currentUserId={currentUser?.id}
              />
            ))}
          </div>

          {j.entries.length === 0 && !j.loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="mb-4 size-12 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">No journal entries yet.</p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                Start writing to track your thoughts and progress.
              </p>
            </div>
          )}

          {j.hasMore && (
            <button
              onClick={() => j.loadMore()}
              className="w-full rounded-xl border border-gray-200 py-2.5 text-sm text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {j.loading ? "Loading..." : "Load more"}
            </button>
          )}
        </>
      )}

      <JournalEditor
        open={j.editorOpen}
        title={j.editorTitle}
        content={j.editorContent}
        mood={j.editorMood}
        tags={j.editorTags}
        isPublic={j.editorIsPublic}
        saving={j.saving}
        error={j.error}
        isEditing={!!j.editingEntry}
        onTitleChange={j.setEditorTitle}
        onContentChange={j.setEditorContent}
        onMoodChange={j.setEditorMood}
        onTagsChange={j.setEditorTags}
        onIsPublicChange={j.setEditorIsPublic}
        onSave={j.saveEntry}
        onClose={j.closeEditor}
      />
    </div>
  )
}
