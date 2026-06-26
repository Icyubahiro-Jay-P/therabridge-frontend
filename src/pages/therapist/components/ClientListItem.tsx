import { Eye, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface ChatUser {
  _id: string
  username: string
  firstName: string
  lastName: string
}

export function ClientListItem({
  client,
  onViewProfile,
}: {
  client: ChatUser
  onViewProfile: (id: string) => void
}) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
          {client.firstName[0]}{client.lastName[0]}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {client.firstName} {client.lastName}
          </p>
          <p className="text-xs text-gray-400">@{client.username}</p>
        </div>
      </div>
      <div className="flex gap-1">
        <Button size="sm" variant="outline" onClick={() => onViewProfile(client._id)} className="text-xs">
          <Eye className="size-3.5" /> Profile
        </Button>
        <Button size="sm" onClick={() => navigate(`/chat/${client.username}`)} className="bg-emerald-600 hover:bg-emerald-700 text-xs">
          <MessageCircle className="size-3.5" /> Message
        </Button>
      </div>
    </div>
  )
}
