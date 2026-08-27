import { useEffect, useMemo, useState } from "react"
import { CalendarCheck, TriangleAlert, X } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { useAvailability, useCreateAppointment } from "@/lib/query-hooks"
import { getErrorMessage } from "@/lib/errors"
import { LIMITS } from "@/lib/limits"

export interface BookableTherapist {
  _id: string
  firstName: string
  lastName: string
  sessionPrice?: number
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatSlotDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const same = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  if (same(date, today)) return "Today"
  if (same(date, tomorrow)) return "Tomorrow"
  return `${DAY_NAMES[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`
}

export function BookSessionModal({
  therapist,
  open,
  onClose,
  onBooked,
}: {
  therapist: BookableTherapist
  open: boolean
  onClose: () => void
  onBooked?: () => void
}) {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [formError, setFormError] = useState<string | null>(null)

  const { data: availability, isLoading, isError } = useAvailability(
    open ? therapist._id : undefined
  )
  const createAppointment = useCreateAppointment()

  useEffect(() => {
    if (open) {
      setSelectedDate("")
      setSelectedTime("")
      setNotes("")
      setFormError(null)
    }
  }, [open])

  const slotsByDate = useMemo(() => {
    if (!availability) return []
    const map = new Map<string, Set<string>>()
    for (const slot of availability.slots) {
      const set = map.get(slot.date) ?? new Set<string>()
      set.add(slot.time)
      map.set(slot.date, set)
    }
    return [...map.entries()].map(([date, times]) => [date, [...times]] as [string, string[]])
  }, [availability])

  const prices = therapist.sessionPrice ?? NaN

  async function handleBook() {
    if (!selectedDate || !selectedTime) {
      setFormError("Please pick a date and time.")
      return
    }
    setFormError(null)
    try {
      const created = await createAppointment.mutateAsync({
        therapistId: therapist._id,
        date: selectedDate,
        time: selectedTime,
        duration: availability?.duration ?? 50,
        notes: notes.trim() || undefined,
      })
      void created
      onClose()
      onBooked?.()
    } catch (err) {
      setFormError(getErrorMessage(err))
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Book a video session
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            With {therapist.firstName} {therapist.lastName}
            {Number.isFinite(prices) && prices > 0 && (
              <span className="ml-1 text-gray-700 dark:text-gray-300">
                · ${prices}/session
              </span>
            )}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
      </div>

      {isLoading && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Loading available slots…
        </p>
      )}

      {isError && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" />
          Could not load availability. Please try again.
        </div>
      )}

      {!isLoading && !isError && slotsByDate.length === 0 && (
        <p className="mt-4 rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          This therapist has no available slots in the next two weeks.
        </p>
      )}

      {!isLoading && !isError && slotsByDate.length > 0 && (
        <div className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
          {slotsByDate.map(([date, times]) => (
            <div key={date}>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {formatSlotDate(date)}
              </p>
              <div className="flex flex-wrap gap-2">
                {times.map((time) => {
                  const active = date === selectedDate && time === selectedTime
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        setSelectedDate(date)
                        setSelectedTime(time)
                        setFormError(null)
                      }}
                      className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
                        active
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-emerald-500 hover:text-emerald-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
          What would you like to talk about? (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={LIMITS.appointment.notes}
          placeholder="A few words to help your therapist prepare…"
          className="w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          rows={3}
        />
        <div className="mt-1 text-right text-xs text-gray-400">
          {notes.length}/{LIMITS.appointment.notes}
        </div>
      </div>

      {formError && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" />
          {formError}
        </div>
      )}

      <Button
        onClick={handleBook}
        disabled={!selectedDate || !selectedTime || createAppointment.isPending}
        className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700"
      >
        <CalendarCheck className="size-4" />
        {createAppointment.isPending ? "Booking…" : "Confirm booking"}
      </Button>
    </Modal>
  )
}