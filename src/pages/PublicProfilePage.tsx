import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, CalendarDays, Lock, Mail, MessageCircle, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { fetchPublicProfile } from "@/lib/auth-api"
import type { PublicProfile } from "@/types/user"
import { ProfileHeader } from "@/pages/components/profile/ProfileHeader"
import { ProfileInfoCard } from "@/pages/components/profile/ProfileInfoCard"
import { PrivateFieldBadge } from "@/pages/components/profile/PrivateFieldBadge"
import { ProfileLoading } from "@/pages/components/profile/ProfileLoading"
import { ProfileError } from "@/pages/components/profile/ProfileError"

export function PublicProfilePage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()

  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      if (!username) return
      try {
        const data = await fetchPublicProfile(username)
        setProfile(data)
      } catch {
        setError("User not found")
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [username])

  if (loading) return <ProfileLoading />
  if (error || !profile) return <ProfileError error={error || "Could not load profile"} />

  return (
    <div className="space-y-8 p-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="size-4" /> Back
      </Button>

      <ProfileHeader profile={profile} />

      <div className="grid gap-4 sm:grid-cols-3">
        <ProfileInfoCard icon={Mail} label="Email">
          {profile.email ? (
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {profile.email}
            </p>
          ) : (
            <PrivateFieldBadge />
          )}
        </ProfileInfoCard>
        <ProfileInfoCard
          icon={Shield}
          label="Role"
          value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
        />
        <ProfileInfoCard
          icon={CalendarDays}
          label="Member since"
          value={profile.createdAt
            ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
            : "Unknown"}
        />
      </div>

      {profile.bio === null && profile.firstName === null && profile.lastName === null && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
          <Lock className="size-4" />
          This user has hidden most of their profile information.
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={() => navigate(`/chat/${profile.username}`)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <MessageCircle className="size-4" />
          Send message
        </Button>
      </div>
    </div>
  )
}
