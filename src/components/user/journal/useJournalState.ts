import { useState, useCallback, useRef, type Dispatch, type SetStateAction } from "react"
import * as journalApi from "@/lib/journal-api"
import type { JournalEntry, JournalComment } from "./types"
import { useAuthStore } from "@/store/auth-store"
import { getErrorMessage } from "@/lib/errors"
import { runOptimistic } from "@/lib/optimistic"

/**
 * Apply one transformation to an entry's comments in both the list and the
 * open-detail view, so every comment action stays consistent everywhere.
 */
function patchEntryComments(
  setEntries: Dispatch<SetStateAction<JournalEntry[]>>,
  setSelectedEntry: Dispatch<SetStateAction<JournalEntry | null>>,
  entryId: string,
  transform: (comments: JournalComment[]) => JournalComment[],
) {
  setEntries((prev) =>
    prev.map((e) => (e._id === entryId ? { ...e, comments: transform(e.comments) } : e))
  )
  setSelectedEntry((prev) =>
    prev && prev._id === entryId ? { ...prev, comments: transform(prev.comments) } : prev
  )
}

export function useJournalState() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMood, setFilterMood] = useState<string | null>(null)

  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [editorOpen, setEditorOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [editorTitle, setEditorTitle] = useState("")
  const [editorContent, setEditorContent] = useState("")
  const [editorMood, setEditorMood] = useState<string | null>(null)
  const [editorTags, setEditorTags] = useState<string[]>([])
  const [editorIsPublic, setEditorIsPublic] = useState(false)

  const fetchVersionRef = useRef(0)

  const fetchEntries = useCallback(async (opts: { page?: number; mood?: string | null; search?: string; append?: boolean }) => {
    const version = ++fetchVersionRef.current
    if (!opts.append) setLoading(true)
    setLoadError(null)
    try {
      const data = await journalApi.getMyEntries({
        page: opts.page ?? 1,
        limit: 20,
        mood: opts.mood ?? undefined,
        search: opts.search || undefined,
      })
      if (version !== fetchVersionRef.current) return
      setEntries((prev) => (opts.append ? [...prev, ...data.entries] : data.entries))
      setHasMore(data.hasMore)
    } catch (err) {
      if (version !== fetchVersionRef.current) return
      setLoadError(err instanceof Error ? err.message : "Failed to load entries")
    } finally {
      if (version === fetchVersionRef.current) setLoading(false)
    }
  }, [])

  const loadMore = useCallback(async () => {
    const currentCount = entries.length
    const nextPage = Math.floor(currentCount / 20) + 1
    await fetchEntries({ page: nextPage, mood: filterMood, search: searchQuery, append: true })
  }, [entries.length, filterMood, searchQuery, fetchEntries])

  const openEditor = useCallback((entry?: JournalEntry) => {
    if (entry) {
      setEditingEntry(entry)
      setEditorTitle(entry.title)
      setEditorContent(entry.content)
      setEditorMood(entry.mood ?? null)
      setEditorTags([...entry.tags])
      setEditorIsPublic(entry.isPublic)
    } else {
      setEditingEntry(null)
      setEditorTitle("")
      setEditorContent("")
      setEditorMood(null)
      setEditorTags([])
      setEditorIsPublic(false)
    }
    setEditorOpen(true)
    setError(null)
    setSuccess(null)
  }, [])

  const closeEditor = useCallback(() => {
    setEditorOpen(false)
    setEditingEntry(null)
    setError(null)
  }, [])

  const saveEntry = useCallback(async () => {
    if (!editorTitle.trim() || !editorContent.trim()) {
      setError("Title and content are required")
      return
    }
    try {
      setSaving(true)
      setError(null)
      const payload = {
        title: editorTitle.trim(),
        content: editorContent.trim(),
        mood: editorMood,
        tags: editorTags,
        isPublic: editorIsPublic,
      }
      if (editingEntry) {
        const updated = await journalApi.updateEntry(editingEntry._id, payload)
        setEntries((prev) => prev.map((e) => (e._id === updated._id ? updated : e)))
        if (selectedEntry?._id === updated._id) setSelectedEntry(updated)
      } else {
        const created = await journalApi.createEntry(payload)
        setEntries((prev) => [created, ...prev])
      }
      setEditorOpen(false)
      setEditingEntry(null)
      setSuccess(editingEntry ? "Entry updated" : "Entry created")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save entry")
    } finally {
      setSaving(false)
    }
  }, [editorTitle, editorContent, editorMood, editorTags, editorIsPublic, editingEntry, selectedEntry])

  const removeEntry = useCallback(
    async (id: string) => {
      await runOptimistic({
        lockKey: `journal-entry:${id}`,
        snapshot: () => ({
          index: entries.findIndex((e) => e._id === id),
          entry: entries.find((e) => e._id === id) ?? null,
        }),
        apply: () => {
          setEntries((prev) => prev.filter((e) => e._id !== id))
          if (selectedEntry?._id === id) setSelectedEntry(null)
          setSuccess("Entry deleted")
        },
        commit: () => journalApi.deleteEntry(id),
        rollback: ({ index, entry }) => {
          if (!entry) return
          setEntries((prev) => {
            if (prev.some((e) => e._id === id)) return prev
            const next = [...prev]
            next.splice(Math.min(Math.max(index, 0), next.length), 0, entry)
            return next
          })
        },
        onError: (err) => {
          setSuccess(null)
          setError(getErrorMessage(err))
        },
      })
    },
    [entries, selectedEntry]
  )

  const openEntry = useCallback(async (id: string) => {
    try {
      const entry = await journalApi.getEntry(id)
      setSelectedEntry(entry)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load entry")
    }
  }, [])

  const addCommentToEntry = useCallback(
    async (entryId: string, content: string) => {
      if (!content.trim()) return
      const comment = await journalApi.addComment(entryId, content.trim())
      setEntries((prev) =>
        prev.map((e) => (e._id === entryId ? { ...e, comments: [...e.comments, comment] } : e)),
      )
      if (selectedEntry?._id === entryId) {
        setSelectedEntry((prev) => (prev ? { ...prev, comments: [...prev.comments, comment] } : prev))
      }
    },
    [selectedEntry],
  )

  const removeCommentFromEntry = useCallback(
    async (entryId: string, commentId: string) => {
      await journalApi.deleteComment(entryId, commentId)
      setEntries((prev) =>
        prev.map((e) =>
          e._id === entryId ? { ...e, comments: e.comments.filter((c) => c._id !== commentId) } : e,
        ),
      )
      if (selectedEntry?._id === entryId) {
        setSelectedEntry((prev) =>
          prev ? { ...prev, comments: prev.comments.filter((c) => c._id !== commentId) } : prev,
        )
      }
    },
    [selectedEntry],
  )

  return {
    entries, loading, loadError, hasMore,
    searchQuery, setSearchQuery,
    filterMood, setFilterMood,
    selectedEntry, setSelectedEntry, openEntry,
    saving, error, success,
    setError, setSuccess,
    editorOpen, editingEntry,
    editorTitle, setEditorTitle,
    editorContent, setEditorContent,
    editorMood, setEditorMood,
    editorTags, setEditorTags,
    editorIsPublic, setEditorIsPublic,
    openEditor, closeEditor, saveEntry,
    removeEntry,
    addCommentToEntry, removeCommentFromEntry,
    loadMore, fetchEntries,
  }
}
