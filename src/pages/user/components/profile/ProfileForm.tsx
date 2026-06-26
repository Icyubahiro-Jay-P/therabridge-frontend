import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ProfileForm as ProfileFormType } from "./types"

interface Props {
  profileForm: ProfileFormType
  isLoading: boolean
  profileMessage: string
  profileError: string
  onFieldChange: (field: keyof ProfileFormType, value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function ProfileForm({ profileForm, isLoading, profileMessage, profileError, onFieldChange, onSubmit }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit profile</CardTitle>
        <CardDescription>Update your name, date of birth, and bio.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {profileMessage && (
            <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="size-4 shrink-0" />
              {profileMessage}
            </p>
          )}
          {profileError && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              {profileError}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-firstName">First name</Label>
              <Input id="profile-firstName" value={profileForm.firstName} onChange={(e) => onFieldChange("firstName", e.target.value)} required minLength={2} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-lastName">Last name</Label>
              <Input id="profile-lastName" value={profileForm.lastName} onChange={(e) => onFieldChange("lastName", e.target.value)} required minLength={2} disabled={isLoading} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-dateOfBirth">Date of birth</Label>
            <Input id="profile-dateOfBirth" type="date" value={profileForm.dateOfBirth} onChange={(e) => onFieldChange("dateOfBirth", e.target.value)} required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-bio">Bio</Label>
            <Textarea id="profile-bio" value={profileForm.bio} onChange={(e) => onFieldChange("bio", e.target.value)} maxLength={300} rows={3} disabled={isLoading} placeholder="Tell others a little about yourself..." />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2"><Loader2 className="size-4 animate-spin" />Saving...</span>
            ) : "Save profile"}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
