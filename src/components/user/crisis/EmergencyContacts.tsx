import { Phone } from "lucide-react"

const emergencyContacts = [
  { name: "Emergency Services", number: "911", description: "For immediate danger" },
  { name: "Suicide & Crisis Lifeline", number: "988", description: "24/7 support" },
  { name: "Crisis Text Line", number: "741741", description: "Text HOME to connect" },
]

export function EmergencyContacts() {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/30">
      <h2 className="mb-3 flex items-center gap-2 font-semibold text-red-700 dark:text-red-400">
        <Phone className="size-4" /> Emergency Contacts
      </h2>
      <div className="space-y-2">
        {emergencyContacts.map((c) => (
          <div key={c.number} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 dark:bg-gray-900">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</p>
              <p className="text-xs text-gray-400">{c.description}</p>
            </div>
            <a href={`tel:${c.number}`} className="text-lg font-bold text-red-600 hover:underline dark:text-red-400">{c.number}</a>
          </div>
        ))}
      </div>
    </div>
  )
}
