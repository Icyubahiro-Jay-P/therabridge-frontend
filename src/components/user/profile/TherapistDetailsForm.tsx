import { useState } from "react"
import { CheckCircle2, Loader2, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LIMITS } from "@/lib/limits"
import { useAuthStore } from "@/store/auth-store"
import type { WeeklyAvailabilitySlot } from "@/types/user"

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const HOURS = Array.from({ length: 24 }).flatMap((_, h) => {
  const hh = String(h).padStart(2, "0")
  return [`${hh}:00`, `${hh}:30`]
})

export function TherapistDetailsForm() {
  const user = useAuthStore((state) => state.user)
  const updateProfile = useAuthStore((state) => state.updateProfile)

  const [specialization, setSpecialization] = useState((user?.specialization ?? []).join(", "))
  const [credentials, setCredentials] = useState(user?.credentials ?? "")
  const [yearsExperience, setYearsExperience] = useState(user?.yearsExperience ? String(user.yearsExperience) : "")
  const [languages, setLanguages] = useState((user?.languages ?? []).join(", "))
  const [availability, setAvailability] = useState<WeeklyAvailabilitySlot[]>(user?.weeklyAvailability ?? [])
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  if (!user || user.role !== "therapist") return null

  function toggleDay(dayOfWeek: number) {
    setAvailability((prev) => {
      const existing = prev.find((s) => s.dayOfWeek === dayOfWeek)
      if (existing) {
        return prev.filter((s) => s.dayOfWeek !== dayOfWeek)
      }
      if (prev.length >= LIMITS.therapist.maxAvailabilitySlots) return prev
      return [...prev, { dayOfWeek, startTime: "09:00", endTime: "17:00" }]
    })
  }

  function updateRow(dayOfWeek: number, patch: Partial<Pick<WeeklyAvailabilitySlot, "startTime" | "endTime">>) {
    setAvailability((prev) =>
      prev.map((s) => (s.dayOfWeek === dayOfWeek ? { ...s, ...patch } : s))
    )
  }

  function parseList(value: string): string[] {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage("")
    setError("")
    setSaving(true)
    try {
      await updateProfile({
        specialization: parseList(specialization),
        credentials: credentials.trim() || undefined,
        yearsExperience: yearsExperience ? Number(yearsExperience) : undefined,
        languages: parseList(languages),
        weeklyAvailability: availability.length ? availability : undefined,
      })
      setMessage("Professional details saved.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional details</CardTitle>
        <CardDescription>
          Show the community what you specialize in and set your session availability.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {message && (
            <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="size-4 shrink-0" />
              {message}
            </p>
          )}
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="th-specialization">Specializations</Label>
              <Input
                id="th-specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Anxiety, CBT, Couples…"
                disabled={saving}
              />
              <p className="text-xs text-gray-400">Comma-separated, shown as tags.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="th-credentials">Credentials</Label>
              <Input
                id="th-credentials"
                value={credentials}
                onChange={(e) => setCredentials(e.target.value.slice(0, LIMITS.therapist.credentials))}
                placeholder="Licensed Clinical Psychologist"
                maxLength={LIMITS.therapist.credentials}
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="th-years">Years of experience</Label>
              <Input
                id="th-years"
                type="number"
                min={0}
                max={70}
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="th-languages">Languages</Label>
              <Input
                id="th-languages"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="English, Spanish…"
                disabled={saving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Weekly availability</Label>
            <p className="text-xs text-gray-400">
              Pick the days and hours you can take video sessions. Clients book from these slots.
            </p>
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              {DAY_NAMES.map((name, dow) => {
                const row = availability.find((s) => s.dayOfWeek === dow)
                return (
                  <div key={name} className="flex flex-wrap items-center gap-3 py-1.5">
                    <label className="flex min-w-32 items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={!!row}
                        onChange={() => toggleDay(dow)}
                        className="size-4 accent-emerald-600"
                      />
                      {name}
                    </label>
                    {row && (
                      <span className="flex items-center gap-2">
                        <select
                          value={row.startTime}
                          onChange={(e) => updateRow(dow, { startTime: e.target.value })}
                          disabled={saving}
                          className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                          {HOURS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <span className="text-gray-400">to</span>
                        <select
                          value={row.endTime}
                          onChange={(e) => updateRow(dow, { endTime: e.target.value })}
                          disabled={saving}
                          className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                          {HOURS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => toggleDay(dow)}
                          className="p-1 text-red-500 hover:text-red-600"
                          aria-label={`Remove ${name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2"><Save className="size-4" /> Save details</span>
            )}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}