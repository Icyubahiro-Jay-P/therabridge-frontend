import { useEffect, useState } from "react"
import { Check, Loader2, Plus, Save, ShieldCheck, TriangleAlert, X } from "lucide-react"
import { Link } from "react-router-dom"

import { api } from "@/lib/api"
import { LIMITS } from "@/lib/limits"
import {
  emptySafetyPlan,
  SAFETY_PLAN_SECTIONS,
  safetyPlanHasContent,
  type SafetyPlan,
} from "@/lib/safetyPlan"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const ITEM_LIMIT = LIMITS.safetyPlan.item
const MAX_ITEMS = LIMITS.safetyPlan.maxItems

function initialDrafts(): Record<keyof SafetyPlan, string> {
  const drafts = {} as Record<keyof SafetyPlan, string>
  for (const section of SAFETY_PLAN_SECTIONS) {
    drafts[section.key] = ""
  }
  return drafts
}

export function SafetyPlanPage() {
  const [plan, setPlan] = useState<SafetyPlan>(emptySafetyPlan)
  const [drafts, setDrafts] = useState<Record<keyof SafetyPlan, string>>(initialDrafts)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const { data } = await api.get<SafetyPlan>("/api/safety-plan")
        if (!mounted) return
        setPlan({ ...emptySafetyPlan(), ...data })
      } catch (err) {
        if (mounted) {
          setLoadError(err instanceof Error ? err.message : "Failed to load your safety plan")
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [])

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      await api.put("/api/safety-plan", plan)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save your safety plan")
    } finally {
      setSaving(false)
    }
  }

  function addItem(key: keyof SafetyPlan) {
    const value = drafts[key].trim()
    if (!value || value.length > ITEM_LIMIT || plan[key].length >= MAX_ITEMS) return
    setPlan((prev) => ({ ...prev, [key]: [...prev[key], value] }))
    setDrafts((prev) => ({ ...prev, [key]: "" }))
    setSaved(false)
  }

  function removeItem(key: keyof SafetyPlan, index: number) {
    setPlan((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }))
    setSaved(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
          <ShieldCheck className="size-6 text-emerald-600" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My safety plan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your plan is shown to you first whenever you ask for help, and to your
            therapist so they can support you. It's encrypted at rest.
          </p>
        </div>
      </div>

      {loadError && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
          <TriangleAlert className="size-4 shrink-0" /> {loadError}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-4">
        {SAFETY_PLAN_SECTIONS.map((section) => {
          const Icon = section.icon
          const items = plan[section.key]
          const draft = drafts[section.key]
          const atLimit = items.length >= MAX_ITEMS
          const canAdd =
            draft.trim().length > 0 &&
            draft.trim().length <= ITEM_LIMIT &&
            !atLimit
          return (
            <div
              key={section.key}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900"
            >
              <div className="mb-1 flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                  <Icon className="size-4 text-emerald-600" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {section.label}
                  </h2>
                  <p className="text-xs text-gray-400">{section.hint}</p>
                </div>
              </div>

              {items.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {items.map((item, i) => (
                    <li
                      key={`${item}-${i}`}
                      className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      <span className="min-w-0">{item}</span>
                      <button
                        onClick={() => removeItem(section.key, i)}
                        aria-label={`Remove ${section.label} item`}
                        className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-red-600 dark:hover:bg-gray-700"
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-3 flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => {
                    setDrafts((prev) => ({
                      ...prev,
                      [section.key]: e.target.value.slice(0, ITEM_LIMIT),
                    }))
                    setSaved(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addItem(section.key)
                    }
                  }}
                  placeholder={atLimit ? "Section full" : section.placeholder}
                  maxLength={ITEM_LIMIT}
                  disabled={atLimit}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                  onClick={() => addItem(section.key)}
                  disabled={!canAdd}
                  aria-label={`Add ${section.label} item`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-40"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className={cn("text-xs", atLimit ? "text-amber-600 dark:text-amber-400" : "text-gray-400")}>
                  {items.length}/{MAX_ITEMS}
                </span>
                {draft.length > 0 && (
                  <span className="text-xs tabular-nums text-gray-400">
                    {draft.length}/{ITEM_LIMIT}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-gray-400">
          You can also build or review this from the{" "}
          <Link to="/crisis" className="font-medium text-red-600 hover:underline dark:text-red-400">
            Crisis Support
          </Link>{" "}
          page.
        </p>
        <Button
          onClick={handleSave}
          disabled={saving || !safetyPlanHasContent(plan)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : saved ? (
            <Check className="size-4" />
          ) : (
            <Save className="size-4" />
          )}
          {saved ? "Saved" : "Save plan"}
        </Button>
      </div>
    </div>
  )
}
