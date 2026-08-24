import {
  Pill, Plus, Trash2, Edit3, Check, X, AlertTriangle,
  Calendar, TrendingUp, Flame, Clock, ChevronDown, ChevronUp,
} from "lucide-react"
import { useMedicationState } from "./useMedicationState"
import { FREQUENCY_LABELS } from "@/lib/medication-api"
import { EmptyState } from "@/components/user/shared/EmptyState"
import { useEffect, useRef, useState } from "react"

export function MedicationsPage() {
  const m = useMedicationState()
  const initializedRef = useRef(false)
  const [view, setView] = useState<"today" | "all" | "logs" | "stats">("today")
  const [filterMeds, setFilterMeds] = useState<string>("")

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      m.fetchMedications()
      m.fetchLogs({ page: 1 })
      m.fetchStats()
    }
  })

  function getNextDoseInfo(timeOfDay: string | null, frequency: string): string {
    if (frequency === "as_needed") return "As needed"
    if (!timeOfDay) return ""
    const now = new Date()
    const [h, min] = timeOfDay.split(":").map(Number)
    const doseTime = new Date(now)
    doseTime.setHours(h, min, 0, 0)
    if (doseTime > now) {
      const diff = doseTime.getTime() - now.getTime()
      const hrs = Math.floor(diff / 3600000)
      const mins = Math.floor((diff % 3600000) / 60000)
      if (hrs > 0) return `in ${hrs}h ${mins}m`
      return `in ${mins}m`
    }
    return "Taken"
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track your medication adherence.</p>
        </div>
        <button
          onClick={() => m.openForm()}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus className="size-4" />
          Add Medication
        </button>
      </div>

      {m.success && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          {m.success}
        </div>
      )}

      {m.loadError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <AlertTriangle className="size-4 shrink-0" />
          {m.loadError}
        </div>
      )}

      {/* Stats Bar */}
      {m.stats && (
        <div className="flex gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <TrendingUp className="size-5 text-emerald-500" />
            <div>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{m.stats.adherenceRate}%</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">adherence</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30">
            <Flame className="size-5 text-amber-600" />
            <div>
              <p className="text-lg font-bold text-amber-700 dark:text-amber-400">{m.stats.streak}</p>
              <p className="text-xs text-amber-600 dark:text-amber-600">day streak</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
            <Pill className="size-5 text-gray-400" />
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{m.stats.takenDoses}/{m.stats.totalDoses}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">doses taken</p>
            </div>
          </div>
        </div>
      )}

      {/* View Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {([["today", "Today"], ["all", "All Meds"], ["logs", "Logs"], ["stats", "Stats"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              view === key
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TODAY VIEW */}
      {view === "today" && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Medications</h2>
          {m.loadError ? null : m.loading && m.activeMedications.length === 0 ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>
          ) : m.activeMedications.length === 0 ? (
            <EmptyState
              icon={Pill}
              title="No active medications"
              description="Track your prescriptions, get dose reminders and build an adherence streak. Add your first medication to get started."
              action={
                <button
                  onClick={() => m.openForm()}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  <Plus className="size-4" />
                  Add your first medication
                </button>
              }
            />
          ) : (
            m.activeMedications.map((med) => (
              <div
                key={med._id}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Pill className="size-4 text-emerald-500" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">{med.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {med.dosage} &middot; {FREQUENCY_LABELS[med.frequency] || med.frequency}
                    </p>
                    {med.timeOfDay && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="size-3" />
                        {med.timeOfDay} &middot; {getNextDoseInfo(med.timeOfDay, med.frequency)}
                      </div>
                    )}
                    {med.notes && (
                      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 italic">{med.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => m.openSideEffectModal(med)}
                      className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                    >
                      <Check className="size-3.5 inline mr-1" />
                      Take
                    </button>
                    <button
                      onClick={() => {
                        m.logDose(true, med)
                      }}
                      className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => m.openForm(med)}
                      className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Edit3 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => m.removeMedication(med._id)}
                      className="rounded-lg p-1.5 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ALL MEDS VIEW */}
      {view === "all" && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Medications</h2>
          {m.loadError ? null : m.loading && m.medications.length === 0 ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>
          ) : m.medications.length === 0 ? (
            <EmptyState
              icon={Pill}
              title="No medications yet"
              description="Your full medication list lives here, including past treatments. Add a medication to start logging doses."
              action={
                <button
                  onClick={() => m.openForm()}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  <Plus className="size-4" />
                  Add your first medication
                </button>
              }
            />
          ) : (
            m.medications.map((med) => (
              <div
                key={med._id}
                className={`rounded-xl border p-4 ${
                  med.active
                    ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                    : "border-gray-100 bg-gray-50 opacity-60 dark:border-gray-800 dark:bg-gray-950"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Pill className={`size-4 ${med.active ? "text-emerald-500" : "text-gray-400"}`} />
                      <h3 className="font-semibold text-gray-900 dark:text-white">{med.name}</h3>
                      {!med.active && (
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {med.dosage} &middot; {FREQUENCY_LABELS[med.frequency] || med.frequency}
                    </p>
                    {med.timeOfDay && (
                      <p className="mt-1 text-xs text-gray-400">Scheduled: {med.timeOfDay}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      Started {new Date(med.startDate).toLocaleDateString()}
                      {med.endDate && ` &middot; Ends ${new Date(med.endDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => m.openForm(med)}
                      className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Edit3 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => m.removeMedication(med._id)}
                      className="rounded-lg p-1.5 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* LOGS VIEW */}
      {view === "logs" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dose Logs</h2>
            <select
              value={filterMeds}
              onChange={(e) => {
                setFilterMeds(e.target.value)
                m.fetchLogs({ page: 1, medicationId: e.target.value || undefined })
              }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-emerald-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              <option value="">All medications</option>
              {m.medications.map((med) => (
                <option key={med._id} value={med._id}>{med.name}</option>
              ))}
            </select>
          </div>
          {!m.loading && m.medications.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No dose logs yet"
              description="Every dose you take or skip is recorded here so you and your care team can review your adherence over time."
              action={
                <button
                  onClick={() => m.openForm()}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  <Plus className="size-4" />
                  Add a medication to begin
                </button>
              }
            />
          ) : m.logs.length === 0 && !m.logsLoading ? (
            <EmptyState
              icon={Calendar}
              title="No dose logs yet"
              description="Use “Take” or “Skip” on today's medications and your dose history will build up here."
            />
          ) : (
            <div className="space-y-2">
              {m.logs.map((log) => {
                const medName = typeof log.medication === "object" ? log.medication.name : "Medication"
                const medDosage = typeof log.medication === "object" ? log.medication.dosage : ""
                return (
                  <div
                    key={log._id}
                    className={`rounded-xl border p-3 ${
                      log.skipped
                        ? "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
                        : "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{medName} {medDosage}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(log.takenAt).toLocaleString()} &middot; {log.skipped ? "Skipped" : "Taken"}
                        </p>
                      </div>
                      {log.sideEffects.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {log.sideEffects.map((effect, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            >
                              {effect}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {log.notes && (
                      <p className="mt-2 text-xs italic text-gray-400 dark:text-gray-500">{log.notes}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
          {m.logsHasMore && (
            <button
              onClick={() => m.fetchLogs({ page: Math.floor(m.logs.length / 20) + 1, medicationId: filterMeds || undefined, append: true })}
              className="w-full rounded-xl border border-gray-200 py-2.5 text-sm text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {m.logsLoading ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      )}

      {/* STATS VIEW */}
      {view === "stats" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Adherence Stats (30 days)</h2>

          {/* Calendar */}
          {m.stats && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Adherence Calendar</h3>
              <AdherenceCalendar takenDaysMap={m.stats.takenDaysMap} />
            </div>
          )}

          {/* Side effects */}
          {m.stats && m.stats.sideEffects.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Common Side Effects</h3>
              <div className="space-y-2">
                {m.stats.sideEffects.map((effect) => (
                  <div key={effect.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{effect.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{
                            width: `${Math.min(100, (effect.count / (m.stats?.totalDoses || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{effect.count}x</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {m.stats && m.stats.sideEffects.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="text-sm text-gray-500 dark:text-gray-400">No side effects logged yet.</p>
            </div>
          )}

          {!m.stats && (
            <EmptyState
              icon={TrendingUp}
              title="No adherence data yet"
              description="Once you start logging doses, your adherence rate, streaks and side-effect patterns will appear here."
            />
          )}
        </div>
      )}

      {/* ADD/EDIT MEDICATION MODAL */}
      {m.formOpen && (
        <Modal open onClose={m.closeForm} panelClassName="max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {m.editingMed ? "Edit Medication" : "Add Medication"}
              </h2>
              <button onClick={m.closeForm} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="size-5" />
              </button>
            </div>

            {m.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                {m.error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  value={m.formName}
                  onChange={(e) => m.setFormName(e.target.value)}
                  maxLength={100}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g. Sertraline"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Dosage</label>
                <input
                  value={m.formDosage}
                  onChange={(e) => m.setFormDosage(e.target.value)}
                  maxLength={50}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g. 50mg"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</label>
                <select
                  value={m.formFrequency}
                  onChange={(e) => m.setFormFrequency(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-emerald-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  <option value="daily">Once daily</option>
                  <option value="twice_daily">Twice daily</option>
                  <option value="three_times">Three times daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="as_needed">As needed</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Time of Day</label>
                <input
                  type="time"
                  value={m.formTimeOfDay}
                  onChange={(e) => m.setFormTimeOfDay(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                  <input
                    type="date"
                    value={m.formStartDate}
                    onChange={(e) => m.setFormStartDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">End Date (optional)</label>
                  <input
                    type="date"
                    value={m.formEndDate}
                    onChange={(e) => m.setFormEndDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
                <textarea
                  value={m.formNotes}
                  onChange={(e) => m.setFormNotes(e.target.value)}
                  maxLength={200}
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Any notes..."
                />
                <p className="mt-1 text-xs text-gray-400">{m.formNotes.length}/200</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={m.closeForm}
                className="rounded-xl px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={m.saveMedication}
                disabled={m.saving}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {m.saving ? "Saving..." : m.editingMed ? "Update" : "Add Medication"}
              </button>
            </div>
        </Modal>
      )}

      {/* SIDE EFFECT MODAL */}
      {m.sideEffectModalOpen && m.pendingLogMedication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Log Dose</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {m.pendingLogMedication.name} &middot; {m.pendingLogMedication.dosage}
                </p>
              </div>
              <button onClick={m.closeSideEffectModal} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="size-5" />
              </button>
            </div>

            {m.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                {m.error}
              </div>
            )}

            {/* Side effects input */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Side Effects (optional)</label>
              <div className="flex gap-2">
                <input
                  value={m.sideEffectInput}
                  onChange={(e) => m.setSideEffectInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      m.addSideEffect()
                    }
                  }}
                  maxLength={100}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g. Headache"
                />
                <button
                  onClick={m.addSideEffect}
                  className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                >
                  Add
                </button>
              </div>
              {m.sideEffects.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.sideEffects.map((effect, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                      {effect}
                      <button onClick={() => m.removeSideEffect(i)} className="hover:text-amber-900 dark:hover:text-amber-200">
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
              <textarea
                value={m.logNotes}
                onChange={(e) => m.setLogNotes(e.target.value)}
                maxLength={200}
                rows={2}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Any notes about this dose..."
              />
              <p className="mt-1 text-xs text-gray-400">{m.logNotes.length}/200</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={m.closeSideEffectModal}
                className="rounded-xl px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => m.logDose(false)}
                disabled={m.saving}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {m.saving ? "Saving..." : "Log Dose (+2 pts)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AdherenceCalendar({ takenDaysMap }: { takenDaysMap: Record<string, boolean> }) {
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <button onClick={prevMonth} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <ChevronDown className="size-4 rotate-90" />
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {monthNames[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <ChevronUp className="size-4 rotate-90" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {dayNames.map((d) => (
          <div key={d} className="text-xs font-medium text-gray-400">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          const taken = takenDaysMap[dateStr]
          const isToday = dateStr === today.toISOString().slice(0, 10)
          return (
            <div
              key={i}
              className={`flex size-8 items-center justify-center rounded-lg text-xs ${
                taken
                  ? "bg-emerald-500 text-white"
                  : isToday
                    ? "border border-emerald-400 text-emerald-600 dark:text-emerald-400"
                    : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}
