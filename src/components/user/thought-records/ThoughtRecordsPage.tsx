import { Brain, Plus, Search, TrendingDown, TrendingUp } from "lucide-react"
import { useThoughtRecordState } from "./useThoughtRecordState"
import { ThoughtRecordEditor } from "./ThoughtRecordEditor"
import { ThoughtRecordCard } from "./ThoughtRecordCard"
import { ThoughtRecordDetail } from "./ThoughtRecordDetail"
import { useAuthStore } from "@/store/auth-store"
import { EmptyState } from "@/components/user/shared/EmptyState"
import { useEffect, useRef, useState } from "react"
import type { ThoughtRecord } from "@/lib/thoughtRecord-api"

const DISTORTIONS: Record<string, string> = {
  all_or_nothing: "All-or-Nothing Thinking",
  overgeneralization: "Overgeneralization",
  mental_filter: "Mental Filter",
  disqualifying_positive: "Disqualifying the Positive",
  mind_reading: "Mind Reading",
  fortune_telling: "Fortune Telling",
  magnification: "Magnification",
  minimization: "Minimization",
  emotional_reasoning: "Emotional Reasoning",
  should_statements: "Should Statements",
  labeling: "Labeling",
  personalization: "Personalization",
  none: "No Distortion",
}

export function ThoughtRecordsPage() {
  const s = useThoughtRecordState()
  const currentUser = useAuthStore((s) => s.user)
  const initializedRef = useRef(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ThoughtRecord | null>(null)

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      s.fetchRecords({ page: 1, distortion: null, mood: null, search: "" })
      s.fetchStats()
    }
  })

  const openEditor = (record?: ThoughtRecord) => {
    setEditingRecord(record ?? null)
    setEditorOpen(true)
  }

  const closeEditor = () => {
    setEditorOpen(false)
    setEditingRecord(null)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {s.selectedRecord ? (
        <ThoughtRecordDetail
          record={s.selectedRecord}
          onBack={() => s.setSelectedRecord(null)}
          onEdit={(r) => { s.setSelectedRecord(null); openEditor(r as ThoughtRecord) }}
          onDelete={s.deleteRecord}
          currentUserId={currentUser?.id}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thought Records</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Challenge negative thoughts and build cognitive flexibility.
              </p>
            </div>
            <button
              onClick={() => openEditor()}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
            >
              <Plus className="size-4" />
              New Record
            </button>
          </div>

          {s.success && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
              {s.success}
            </div>
          )}

          {s.stats && s.stats.totalRecords > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Records</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{s.stats.totalRecords}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs text-gray-500 dark:text-gray-400">Last 30 Days</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{s.stats.recentRecords}</p>
              </div>
              {s.stats.avgEmotionBefore != null && (
                <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Distress Before</p>
                  <p className="flex items-center gap-1 text-lg font-bold text-red-600 dark:text-red-400">
                    <TrendingDown className="size-4" />
                    {s.stats.avgEmotionBefore}
                  </p>
                </div>
              )}
              {s.stats.avgEmotionAfter != null && (
                <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Distress After</p>
                  <p className="flex items-center gap-1 text-lg font-bold text-green-600 dark:text-green-400">
                    <TrendingUp className="size-4" />
                    {s.stats.avgEmotionAfter}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={s.searchQuery}
                onChange={(e) => {
                  s.setSearchQuery(e.target.value)
                  s.fetchRecords({ page: 1, search: e.target.value })
                }}
                placeholder="Search records..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <select
              value={s.filterDistortion ?? ""}
              onChange={(e) => {
                const v = e.target.value || null
                s.setFilterDistortion(v)
                s.fetchRecords({ page: 1, distortion: v })
              }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-violet-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              <option value="">All distortions</option>
              {Object.entries(DISTORTIONS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {s.error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              {s.error}
            </div>
          )}

          <div className="space-y-3">
            {s.loading && s.records.length === 0 ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
              ))
            ) : (
              s.records.map((record) => (
                <ThoughtRecordCard
                  key={record._id}
                  record={record}
                  onSelect={() => s.setSelectedRecord(record)}
                  onDelete={() => s.deleteRecord(record._id)}
                  currentUserId={currentUser?.id}
                />
              ))
            )}
          </div>

          {!s.error && !s.loading && s.records.length === 0 && (
            s.searchQuery || s.filterDistortion ? (
              <EmptyState
                icon={Search}
                title="No matching records"
                description="No thought records match your current search or filter. Try different keywords or clear the filter."
              />
            ) : (
              <EmptyState
                icon={Brain}
                title="No thought records yet"
                description="Thought records are a CBT exercise that helps you catch unhelpful thoughts, examine the evidence and reframe them into more balanced ones."
                action={
                  <button
                    onClick={() => openEditor()}
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                  >
                    <Plus className="size-4" />
                    Record your first thought
                  </button>
                }
              />
            )}
          )}

          {s.hasMore && (
            <button
              onClick={() => s.loadMore()}
              className="w-full rounded-xl border border-gray-200 py-2.5 text-sm text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {s.loading ? "Loading..." : "Load more"}
            </button>
          )}
        </>
      )}

      <ThoughtRecordEditor
        open={editorOpen}
        record={editingRecord}
        saving={s.saving}
        error={s.error}
        onSave={async (data) => {
          if (editingRecord) {
            await s.updateRecord(editingRecord._id, data)
          } else {
            await s.createRecord(data)
          }
          closeEditor()
        }}
        onClose={closeEditor}
      />
    </div>
  )
}
