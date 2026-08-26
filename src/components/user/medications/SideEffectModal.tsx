import { X } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import type { Medication } from "./types"

interface SideEffectModalProps {
  pendingLogMedication: Medication
  error: string | null
  saving: boolean
  sideEffectInput: string
  setSideEffectInput: (v: string) => void
  sideEffects: string[]
  addSideEffect: () => void
  removeSideEffect: (idx: number) => void
  logNotes: string
  setLogNotes: (v: string) => void
  closeSideEffectModal: () => void
  logDose: (skipped?: boolean) => void
}

export function SideEffectModal({
  pendingLogMedication, error, saving,
  sideEffectInput, setSideEffectInput,
  sideEffects, addSideEffect, removeSideEffect,
  logNotes, setLogNotes,
  closeSideEffectModal, logDose,
}: SideEffectModalProps) {
  return (
    <Modal open onClose={closeSideEffectModal} panelClassName="max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Log Dose</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {pendingLogMedication.name} &middot; {pendingLogMedication.dosage}
            </p>
          </div>
          <button onClick={closeSideEffectModal} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Side effects input */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Side Effects (optional)</label>
          <div className="flex gap-2">
            <input
              value={sideEffectInput}
              onChange={(e) => setSideEffectInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addSideEffect()
                }
              }}
              maxLength={100}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="e.g. Headache"
            />
            <button
              onClick={addSideEffect}
              className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            >
              Add
            </button>
          </div>
          {sideEffects.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {sideEffects.map((effect, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                >
                  {effect}
                  <button onClick={() => removeSideEffect(i)} className="hover:text-amber-900 dark:hover:text-amber-200">
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
            value={logNotes}
            onChange={(e) => setLogNotes(e.target.value)}
            maxLength={200}
            rows={2}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Any notes about this dose..."
          />
          <p className="mt-1 text-xs text-gray-400">{logNotes.length}/200</p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={closeSideEffectModal}
            className="rounded-xl px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => logDose(false)}
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Log Dose (+2 pts)"}
          </button>
        </div>
    </Modal>
  )
}
