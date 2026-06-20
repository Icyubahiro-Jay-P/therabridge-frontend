import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

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

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const changePassword = useAuthStore((state) => state.changePassword)

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    bio: "",
    avatar: "",
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

  useEffect(() => {
    if (!user) return

    setProfileForm({
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: toDateInputValue(user.dateOfBirth),
      bio: user.bio ?? "",
      avatar: user.avatar ?? "",
    })
  }, [user])

  if (!user) return null

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
        avatar: profileForm.avatar,
      })
      setProfileMessage("Profile updated successfully.")
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account details synced with the Therabridge backend.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account overview</CardTitle>
          <CardDescription>Read-only fields from your account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted-foreground">Username:</span> @
            {user.username}
          </p>
          <p>
            <span className="text-muted-foreground">Email:</span> {user.email}
          </p>
          <p>
            <span className="text-muted-foreground">Role:</span>{" "}
            <span className="capitalize">{user.role}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Member since:</span>{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "Unknown"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
          <CardDescription>
            Update your personal details and bio.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleProfileSubmit}>
          <CardContent className="space-y-4">
            {profileMessage ? (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                {profileMessage}
              </p>
            ) : null}
            {profileError ? (
              <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
              <Label htmlFor="profile-avatar">Avatar URL</Label>
              <Input
                id="profile-avatar"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={profileForm.avatar}
                onChange={(event) =>
                  updateProfileField("avatar", event.target.value)
                }
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
                rows={4}
                disabled={isLoading}
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
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                {passwordMessage}
              </p>
            ) : null}
            {passwordError ? (
              <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
