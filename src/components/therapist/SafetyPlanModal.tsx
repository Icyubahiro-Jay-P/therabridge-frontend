import { useEffect, useState } from "react"
import { Loader2, ShieldCheck, TriangleAlert, X } from "lucide-react"

import { api } from "@/lib/api"
import { Modal } from "@/components/ui/modal"
import {
  emptySafetyPlan,
  SAFETY_PLAN_SECTIONS,
  type SafetyPlan,
} from "@/lib/safetyPlan"

// Read-only view of a client's safety plan for their assigned therapist (or
// an admin). Every open is audit-logged on the backend (safety_plan_view).
export function SafetyPlanModal({
  clientId,
  clientName,
  onClose,
}: {
  clientId: string | null
  clientName: string
  onClose: () => void
}) {
  const [plan, setPlan] = useState<SafetyPlan>(emptySafetyPlan)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clientId) return
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get<SafetyPlan>(`/api/safety-plan/${clientId}`)
        if (mounted) setPlan({ ...emptySafetyPlan(), ...data })
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load safety plan")
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [clientId])

  const filledSections = SAFETY_PLAN_SECTIONS.filter(
    (section) => plan[section.key].length > 0
  )

  return (
    <Modal open onClose={onClose} panelClassName="flex max-h-[85vh] max-w-lg flex-col border border-gray-200 shadow-2xl dark:border-gray-700 p-0">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <ShieldCheck className="size-5 text-emerald-600" />
            {clientName}&apos;s safety plan
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-6 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              <TriangleAlert className="size-4 shrink-0" /> {error}
            </div>
          ) : filledSections.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              {clientName} hasn&apos;t built a safety plan yet.
            </p>
          ) : (
            <div className="space-y-4">
              {filledSections.map((section) => (
                <div key={section.key}>
                  <p className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                    {section.label}
                  </p>
                  <ul className="mt-1 list-inside list-disc space-y-0.5">
                    {plan[section.key].map((item, i) => (
                      <li
                        key={`${item}-${i}`}
                        className="text-sm text-gray-800 dark:text-gray-200"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="border-t border-gray-100 pt-3 text-[11px] text-gray-400 dark:border-gray-800">
                Reviewed by you - access to this plan is recorded in the audit log.
              </p>
            </div>
          )}
        </div>
    </Modal>
  )
}
