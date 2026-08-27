import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  TriangleAlert,
  Video,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/store/auth-store"
import {
  useMyAppointments,
  useTherapistAppointments,
  useCancelAppointment,
  useUpdateAppointmentStatus,
  useCreateCheckout,
  useTherapistForId,
} from "@/lib/query-hooks"
import { getErrorMessage } from "@/lib/errors"
import type { Appointment } from "@/types/sessions"
import { BookSessionModal } from "@/components/user/therapists/BookSessionModal"

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function fmtWhen(iso: string): string {
  const d = new Date(iso)
  const h = String(d.getHours()).padStart(2, "0")
  const m = String(d.getMinutes()).padStart(2, "0")
  return `${DAY_NAMES[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()} at ${h}:${m}`
}

function participantName(a: Appointment, role: string): string {
  const p = role === "therapist" ? a.user : a.therapist
  if (typeof p === "string") return "Unknown"
  return `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.username
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    completed: "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    cancelled: "bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    missed: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}>
      {status}
    </span>
  )
}

function SessionCard({
  appointment,
  role,
  onCancel,
  onStatus,
  onPay,
  busy,
}: {
  appointment: Appointment
  role: string
  onCancel: (id: string) => void
  onStatus: (id: string, status: "completed" | "missed" | "cancelled") => void
  onPay: (id: string) => void
  busy: boolean
}) {
  const navigate = useNavigate()
  const isUpcoming = appointment.status === "confirmed" && new Date(appointment.start).getTime() > Date.now()
  const therapist =
    typeof appointment.therapist === "object" ? appointment.therapist : undefined

  return (
    <li className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
          <Video className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            {participantName(appointment, role)}
            <StatusBadge status={appointment.status} />
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <CalendarDays className="size-3.5" />
            {fmtWhen(appointment.start)} · {appointment.duration} min
          </p>
        </div>
        {role !== "therapist" && therapist?.specialization?.length ? (
          <span className="text-xs text-gray-400">{therapist.specialization[0]}</span>
        ) : null}
      </div>

      {appointment.notes ? (
        <p className="mt-3 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
          {appointment.notes}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {role !== "therapist" && appointment.status === "confirmed" && (
          <Button size="sm" variant="outline" disabled={busy} onClick={() => onPay(appointment._id)}>
            <CreditCard className="size-3.5" />
            {appointment.paid ? "Paid" : "Pay for session"}
          </Button>
        )}
        {role === "therapist" && appointment.status === "confirmed" && (
          <>
            <Button size="sm" disabled={busy} onClick={() => onStatus(appointment._id, isUpcoming ? "cancelled" : "completed")}>
              <CheckCircle2 className="size-3.5" />
              {isUpcoming ? "Mark cancelled" : "Mark completed"}
            </Button>
            {isUpcoming && (
              <Button size="sm" variant="outline" disabled={busy} onClick={() => onStatus(appointment._id, "missed")}>
                <XCircle className="size-3.5" />
                Mark missed
              </Button>
            )}
          </>
        )}
        {(appointment.status === "confirmed" || appointment.status === "missed") && (
          <Button size="sm" variant="outline" disabled={busy} onClick={() => onCancel(appointment._id)}>
            <XCircle className="size-3.5" /> Cancel
          </Button>
        )}
        {appointment.status === "completed" && role !== "therapist" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const t = typeof appointment.therapist === "object" ? appointment.therapist : undefined
              if (t?.username) navigate(`/chat/${t.username}`)
            }}
            className="ml-auto"
          >
            <MessageCircle className="size-3.5" /> Message
          </Button>
        )}
      </div>
    </li>
  )
}

function UserSessions() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: appointments, isLoading, isError } = useMyAppointments()
  const cancel = useCancelAppointment()
  const checkout = useCreateCheckout()
  const therapistId = useTherapistForId(searchParams.get("book") ?? undefined)

  const [bookedTherapist, setBookedTherapist] = useState<{ _id: string; firstName: string; lastName: string; sessionPrice?: number } | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [paying, setPaying] = useState<string | null>(null)

  useEffect(() => {
    if (therapistId.data) {
      setBookedTherapist({
        _id: therapistId.data._id ?? therapistId.data.id,
        firstName: therapistId.data.firstName,
        lastName: therapistId.data.lastName,
        sessionPrice: therapistId.data.sessionPrice,
      })
      setBookingOpen(true)
    }
  }, [therapistId.data])

  const { upcoming, past } = useMemo(() => {
    const list = [...(appointments ?? [])].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
    return {
      upcoming: list.filter((a) => a.status === "confirmed"),
      past: list.filter((a) => a.status !== "confirmed"),
    }
  }, [appointments])

  async function handleCancel(id: string) {
    setError(null)
    try {
      await cancel.mutateAsync(id)
      setFlash("Session cancelled.")
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function handlePay(id: string) {
    setError(null)
    setPaying(id)
    try {
      const { checkoutUrl } = await checkout.mutateAsync({ intent: "session", appointmentId: id })
      if (checkoutUrl) window.location.href = checkoutUrl
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setPaying(null)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sessions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your upcoming and past video sessions.</p>
        </div>
        <Button onClick={() => navigate("/therapists")} className="bg-emerald-600 hover:bg-emerald-700">
          <CalendarDays className="size-4" /> Book new
        </Button>
      </div>

      {flash && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          {flash}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          Could not load sessions.
        </div>
      ) : upcoming.length === 0 && past.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          No sessions yet. Book your first video session with a therapist.
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Upcoming</h2>
              <ul className="space-y-3">
                {upcoming.map((a) => (
                  <SessionCard
                    key={a._id}
                    appointment={a}
                    role="user"
                    busy={cancel.isPending || paying === a._id}
                    onCancel={handleCancel}
                    onStatus={() => undefined}
                    onPay={handlePay}
                  />
                ))}
              </ul>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Past</h2>
              <ul className="space-y-3">
                {past.map((a) => (
                  <SessionCard
                    key={a._id}
                    appointment={a}
                    role="user"
                    busy={cancel.isPending}
                    onCancel={handleCancel}
                    onStatus={() => undefined}
                    onPay={handlePay}
                  />
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {bookedTherapist && (
        <BookSessionModal
          therapist={bookedTherapist}
          open={bookingOpen}
          onClose={() => {
            setBookingOpen(false)
            setBookedTherapist(null)
          }}
          onBooked={() => setFlash("Session booked! You can pay for it below when ready.")}
        />
      )}
    </div>
  )
}

function TherapistSessions() {
  const { data: appointments, isLoading, isError } = useTherapistAppointments()
  const statusMutation = useUpdateAppointmentStatus()
  const cancel = useCancelAppointment()
  const [flash, setFlash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sorted = useMemo(
    () => [...(appointments ?? [])].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()),
    [appointments]
  )

  async function handleStatus(id: string, status: "completed" | "missed" | "cancelled") {
    setError(null)
    try {
      await statusMutation.mutateAsync({ id, status })
      setFlash(`Session marked ${status}.`)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function handleCancel(id: string) {
    setError(null)
    try {
      await cancel.mutateAsync(id)
      setFlash("Session cancelled.")
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sessions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage client video sessions.</p>
      </div>

      {flash && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          {flash}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          Could not load sessions.
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          No sessions yet. Clients will book here once you set your availability in your profile.
        </div>
      ) : (
        <ul className="space-y-3">
          {sorted.map((a) => (
            <SessionCard
              key={a._id}
              appointment={a}
              role="therapist"
              busy={statusMutation.isPending || cancel.isPending}
              onCancel={handleCancel}
              onStatus={handleStatus}
              onPay={() => undefined}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export function SessionsPage() {
  const role = useAuthStore((state) => state.user?.role)
  return role === "therapist" ? <TherapistSessions /> : <UserSessions />
}