import { X } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import type { Medication } from "./types"

interface MedicationFormModalProps {
  editingMed: Medication | null
  error: string | null
  saving: boolean
  formName: string
  setFormName: (v: string) => void
  formDosage: string
  setFormDosage: (v: string) => void
  formFrequency: string
  setFormFrequency: (v: string) => void
  formTimeOfDay: string
  setFormTimeOfDay: (v: string) => void
  formStartDate: string
  setFormStartDate: (v: string) => void
  formEndDate: string
  setFormEndDate: (v: string) => void
  formNotes: string
  setFormNotes: (v: string) => void
  closeForm: () => void
  saveMedication: () => void
}

export function MedicationFormModal({
  editingMed, error, saving,
  formName, setFormName,
  formDosage, setFormDosage,
  formFrequency, setFormFrequency,
  formTimeOfDay, setFormTimeOfDay,
  formStartDate, setFormStartDate,
  formEndDate, setFormEndDate,
  formNotes, setFormNotes,
  closeForm, saveMedication,
}: MedicationFormModalProps) {
  return (
    <Modal open onClose={closeForm} panelClassName="max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingMed ? "Edit Medication" : "Add Medication"}
          </h2>
          <button onClick={closeForm} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              maxLength={100}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="e.g. Sertraline"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Dosage</label>
            <input
              value={formDosage}
              onChange={(e) => setFormDosage(e.target.value)}
              maxLength={50}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="e.g. 50mg"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</label>
            <select
              value={formFrequency}
              onChange={(e) => setFormFrequency(e.target.value)}
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
              value={formTimeOfDay}
              onChange={(e) => setFormTimeOfDay(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
              <input
                type="date"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">End Date (optional)</label>
              <input
                type="date"
                value={formEndDate}
                onChange={(e) => setFormEndDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              maxLength={200}
              rows={2}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Any notes..."
            />
            <p className="mt-1 text-xs text-gray-400">{formNotes.length}/200</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={closeForm}
            className="rounded-xl px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={saveMedication}
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : editingMed ? "Update" : "Add Medication"}
          </button>
        </div>
    </Modal>
  )
}
