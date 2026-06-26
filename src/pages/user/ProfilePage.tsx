import { CheckCircle2 } from "lucide-react"

import { AccountOverview } from "./components/profile/AccountOverview"
import { AvatarUpload } from "./components/profile/AvatarUpload"
import { PasswordForm } from "./components/profile/PasswordForm"
import { ProfileForm } from "./components/profile/ProfileForm"
import { ProfileHeader } from "./components/profile/ProfileHeader"
import { useProfileState } from "./components/profile/useProfileState"

export function ProfilePage() {
  const {
    user,
    isLoading,
    fileInputRef,
    avatarFile,
    avatarUploading,
    avatarMessage,
    avatarError,
    avatarUrl,
    profileForm,
    profileMessage,
    profileError,
    passwordForm,
    passwordMessage,
    passwordError,
    handleAvatarChange,
    handleRemoveAvatar,
    handleAvatarSubmit,
    updateProfileField,
    updatePasswordField,
    handleProfileSubmit,
    handlePasswordSubmit,
  } = useProfileState()

  if (!user) return null

  return (
    <div className="space-y-8 p-6">
      <ProfileHeader user={user} avatarUrl={avatarUrl} onCameraClick={() => fileInputRef.current?.click()}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </ProfileHeader>

      <AvatarUpload
        avatarFile={avatarFile}
        avatarUploading={avatarUploading}
        avatarMessage={avatarMessage}
        avatarError={avatarError}
        onRemove={handleRemoveAvatar}
        onUpload={handleAvatarSubmit}
      />

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

      <AccountOverview user={user} />

      <ProfileForm
        profileForm={profileForm}
        isLoading={isLoading}
        profileMessage={profileMessage}
        profileError={profileError}
        onFieldChange={updateProfileField}
        onSubmit={handleProfileSubmit}
      />

      <PasswordForm
        isLoading={isLoading}
        passwordMessage={passwordMessage}
        passwordError={passwordError}
        passwordForm={passwordForm}
        onFieldChange={updatePasswordField}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  )
}
