import { Hash } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface TherapistCommunity {
  _id: string
  name: string
  inviteKey: string
  members: { _id: string; firstName: string; lastName: string }[]
  owner: { _id: string; firstName: string; lastName: string }
  description?: string
}

export function TherapistCommunityCard({
  community,
  isOwner,
}: {
  community: TherapistCommunity
  isOwner: boolean
}) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/community/${community.inviteKey}`)}
      className="flex cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900"
    >
      <div className="flex items-center gap-3">
        <span className={`inline-flex size-10 items-center justify-center rounded-xl ${isOwner ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-gray-100 dark:bg-gray-800"}`}>
          <Hash className={`size-5 ${isOwner ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500"}`} />
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900 dark:text-white">{community.name}</p>
          <p className="text-xs text-gray-400">
            {community.members.length} member{community.members.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      {community.description && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{community.description}</p>
      )}
    </div>
  )
}
