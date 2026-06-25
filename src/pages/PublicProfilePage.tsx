import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  CalendarDays,
  Lock,
  Mail,
  MessageCircle,
  Shield,
  TriangleAlert,
  User as UserIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { fetchPublicProfile } from "@/lib/auth-api"
import type { PublicProfile } from "@/types/user"

function getInitials(firstName?: string | null, lastName?: string | null) {
  if (!firstName && !lastName) return "?"
  return `${(firstName || "?")[0]}${(lastName || "")[0] || ""}`.toUpperCase()
}

function PrivateField() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-500">
      <Lock className="size-3.5" />
      <span>Hidden</span>
    </div>
  )
}

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="size-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="space-y-4 p-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="size-4" /> Back
        </Button>
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" />
          {error || "Could not load profile"}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="size-4" /> Back
      </Button>

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <Avatar className="size-24 border-2 border-gray-200 shadow-sm dark:border-gray-700">
            <AvatarImage
              src={
                profile.avatar
                  ? profile.avatar.startsWith("http")
                    ? profile.avatar
                    : `http://localhost:5000${profile.avatar}`
                  : undefined
              }
            />
            <AvatarFallback className="bg-emerald-100 text-lg font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              {getInitials(profile.firstName, profile.lastName)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {profile.firstName || profile.lastName ? (
              <>{profile.firstName ?? ""} {profile.lastName ?? ""}</>
            ) : (
              <span className="flex items-center gap-2">
                <UserIcon className="size-5" /> Private Profile
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{profile.username}
          </p>
          {profile.bio ? (
            <p className="mt-2 max-w-lg text-sm text-gray-600 dark:text-gray-300">
              {profile.bio}
            </p>
          ) : profile.bio === null ? (
            null
          ) : (
            <p className="mt-2 max-w-lg text-sm text-gray-400 italic">No bio</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
          <Mail className="size-5 shrink-0 text-gray-400" />
          <div className="min-w-0">
            <p className="text-xs text-gray-400 dark:text-gray-500">Email</p>
            {profile.email ? (
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {profile.email}
              </p>
            ) : (
              <PrivateField />
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
          <Shield className="size-5 shrink-0 text-gray-400" />
          <div className="min-w-0">
            <p className="text-xs text-gray-400 dark:text-gray-500">Role</p>
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
          <CalendarDays className="size-5 shrink-0 text-gray-400" />
          <div className="min-w-0">
            <p className="text-xs text-gray-400 dark:text-gray-500">Member since</p>
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })
                : "Unknown"}
            </p>
          </div>
        </div>
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
