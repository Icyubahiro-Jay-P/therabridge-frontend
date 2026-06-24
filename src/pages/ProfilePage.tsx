import { useEffect, useRef, useState } from "react"
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  Loader2,
  Mail,
  Shield,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/store/auth-store"

function toDateInputValue(value?: string) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().slice(0, 10)
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const changePassword = useAuthStore((state) => state.changePassword)
  const uploadAvatar = useAuthStore((state) => state.uploadAvatar)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarMessage, setAvatarMessage] = useState("")
  const [avatarError, setAvatarError] = useState("")

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    bio: "",
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [profileMessage, setProfileMessage] = useState("")
  const [profileError, setProfileError] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `http://localhost:5000${user.avatar}`
    : ""

  useEffect(() => {
    if (!user) return
    setProfileForm({
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: toDateInputValue(user.dateOfBirth),
      bio: user.bio ?? "",
    })
    setAvatarPreview(user.avatar ?? "")
  }, [user])

  if (!user) return null

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("File size must be less than 5MB")
      return
    }
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      setAvatarError("Only image files (JPG, PNG, GIF, WebP) are allowed")
      return
    }
    setAvatarFile(file)
    setAvatarError("")
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveAvatar() {
    setAvatarFile(null)
    setAvatarPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setAvatarError("")
  }

  async function handleAvatarSubmit() {
    if (!avatarFile) return
    setAvatarMessage("")
    setAvatarError("")
    setAvatarUploading(true)
    try {
      await uploadAvatar(avatarFile)
      setAvatarMessage("Profile picture updated!")
      setAvatarFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setAvatarUploading(false)
    }
  }

  function updateProfileField(field: keyof typeof profileForm, value: string) {
    setProfileForm((current) => ({ ...current, [field]: value }))
  }

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setProfileMessage("")
    setProfileError("")
    try {
      await updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        dateOfBirth: profileForm.dateOfBirth,
        bio: profileForm.bio,
      })
      setProfileMessage("Profile saved!")
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Update failed")
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordMessage("")
    setPasswordError("")
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.")
      return
    }
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordMessage("Password changed successfully.")
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Password change failed"
      )
    }
  }

  return (
    <div className="space-y-8 p-6">
      {/* ── Profile header ── */}
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <Avatar className="size-24 border-2 border-gray-200 shadow-sm dark:border-gray-700">
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback className="bg-emerald-100 text-lg font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow hover:bg-emerald-600 dark:border-gray-900"
          >
            <Camera className="size-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{user.username}
          </p>
          {user.bio && (
            <p className="mt-2 max-w-lg text-sm text-gray-600 dark:text-gray-300">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Avatar file selected — show upload action */}
      {avatarFile && (
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <span className="truncate text-sm text-gray-600 dark:text-gray-400">
              {avatarFile.name}
            </span>
            <div className="flex gap-2">
              {avatarUploading ? (
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="size-4 animate-spin" />
                  Uploading...
                </span>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={handleAvatarSubmit}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Upload photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveAvatar}
                  >
                    <X className="size-3.5" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      {avatarMessage && (
        <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="size-4 shrink-0" />
          {avatarMessage}
        </p>
      )}
      {avatarError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {avatarError}
        </p>
      )}

      {/* ── Account overview ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {([
          { icon: Mail, label: "Email", value: user.email },
          {
            icon: Shield,
            label: "Role",
            value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
          },
          {
            icon: CalendarDays,
            label: "Member since",
            value: user.createdAt
              ? new Date(user.createdAt).toLocaleDateString(undefined, {
                  month: "long",
                  year: "numeric",
                })
              : "Today",
          },
        ] as const).map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-900"
          >
            <Icon className="size-5 shrink-0 text-gray-400" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {label}
              </p>
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Edit profile ── */}
      <Card>
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
          <CardDescription>Update your name, date of birth, and bio.</CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileSubmit}>
          <CardContent className="space-y-4">
            {profileMessage ? (
              <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="size-4 shrink-0" />
                {profileMessage}
              </p>
            ) : null}
            {profileError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                {profileError}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-firstName">First name</Label>
                <Input
                  id="profile-firstName"
                  value={profileForm.firstName}
                  onChange={(event) =>
                    updateProfileField("firstName", event.target.value)
                  }
                  required
                  minLength={2}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-lastName">Last name</Label>
                <Input
                  id="profile-lastName"
                  value={profileForm.lastName}
                  onChange={(event) =>
                    updateProfileField("lastName", event.target.value)
                  }
                  required
                  minLength={2}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-dateOfBirth">Date of birth</Label>
              <Input
                id="profile-dateOfBirth"
                type="date"
                value={profileForm.dateOfBirth}
                onChange={(event) =>
                  updateProfileField("dateOfBirth", event.target.value)
                }
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-bio">Bio</Label>
              <Textarea
                id="profile-bio"
                value={profileForm.bio}
                onChange={(event) =>
                  updateProfileField("bio", event.target.value)
                }
                maxLength={300}
                rows={3}
                disabled={isLoading}
                placeholder="Tell others a little about yourself..."
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save profile"
              )}
            </Button>
          </CardContent>
        </form>
      </Card>

      {/* ── Change password ── */}
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>
            Choose a strong password with at least 8 characters.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSubmit}>
          <CardContent className="space-y-4">
            {passwordMessage ? (
              <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="size-4 shrink-0" />
                {passwordMessage}
              </p>
            ) : null}
            {passwordError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                {passwordError}
              </p>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) =>
                  setPasswordForm((current) => ({
                    ...current,
                    currentPassword: event.target.value,
                  }))
                }
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      newPassword: event.target.value,
                    }))
                  }
                  required
                  minLength={8}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }))
                  }
                  required
                  minLength={8}
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" variant="outline" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update password"
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
