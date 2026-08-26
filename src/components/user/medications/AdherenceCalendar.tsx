import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export function AdherenceCalendar({ takenDaysMap }: { takenDaysMap: Record<string, boolean> }) {
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
