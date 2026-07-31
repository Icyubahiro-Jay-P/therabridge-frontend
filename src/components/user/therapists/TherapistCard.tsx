import { useNavigate } from "react-router-dom"
import { Briefcase, MessageCircle, Star, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Therapist {
  _id: string
  username: string
  firstName: string
  lastName: string
  bio?: string
  role: string
}

export function TherapistCard({ therapist }: { therapist: Therapist }) {
  const navigate = useNavigate()

  return (
    <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
          <UserIcon className="size-6" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {therapist.firstName} {therapist.lastName}
          </h3>
          <p className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <Briefcase className="size-3" /> Therapist
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
        ))}
        <span className="ml-2 text-xs text-gray-400">5.0</span>
      </div>

      {therapist.bio ? (
        <p className="mt-3 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
          {therapist.bio}
        </p>
      ) : (
        <p className="mt-3 text-sm italic text-gray-400">No bio yet.</p>
      )}

      <div className="mt-4 flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
        <Button
          size="sm"
          onClick={() => navigate(`/chat/${therapist.username}`)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
        >
          <MessageCircle className="size-3.5" /> Message
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => navigate(`/user/@${therapist.username}`)}
        >
          View profile
        </Button>
      </div>
    </div>
  )
}
