import { useEffect, useRef, useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { toDateInputValue, type ProfileForm } from "./types"

export function useProfileState() {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const changePassword = useAuthStore((state) => state.changePassword)
  const uploadAvatar = useAuthStore((state) => state.uploadAvatar)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [, setAvatarPreview] = useState<string>("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarMessage, setAvatarMessage] = useState("")
  const [avatarError, setAvatarError] = useState("")

  const [profileForm, setProfileForm] = useState<ProfileForm>({ firstName: "", lastName: "", dateOfBirth: "", bio: "" })
  const [profileMessage, setProfileMessage] = useState("")
  const [profileError, setProfileError] = useState("")
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const API_BASE_URL = import.meta.env.VITE_API_URL || ""
  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http") ? user.avatar : `${API_BASE_URL}${user.avatar}`
    : ""

  useEffect(() => {
    if (!user) return
    setProfileForm({ firstName: user.firstName, lastName: user.lastName, dateOfBirth: toDateInputValue(user.dateOfBirth), bio: user.bio ?? "" })
    setAvatarPreview(user.avatar ?? "")
  }, [user])

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setAvatarError("File size must be less than 5MB"); return }
    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) { setAvatarError("Only image files (JPG, PNG, GIF, WebP) are allowed"); return }
    setAvatarFile(file)
    setAvatarError("")
    const reader = new FileReader()
    reader.onloadend = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleRemoveAvatar() {
    setAvatarFile(null)
    setAvatarPreview("")
    if (fileInputRef.current) fileInputRef.current.value = ""
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
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err) { setAvatarError(err instanceof Error ? err.message : "Upload failed") }
    finally { setAvatarUploading(false) }
  }

  function updateProfileField(field: keyof ProfileForm, value: string) { setProfileForm((prev) => ({ ...prev, [field]: value })) }
  function updatePasswordField(field: "currentPassword" | "newPassword" | "confirmPassword", value: string) { setPasswordForm((prev) => ({ ...prev, [field]: value })) }

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setProfileMessage("")
    setProfileError("")
    try {
      await updateProfile({ firstName: profileForm.firstName, lastName: profileForm.lastName, dateOfBirth: profileForm.dateOfBirth, bio: profileForm.bio })
      setProfileMessage("Profile saved!")
    } catch (err) { setProfileError(err instanceof Error ? err.message : "Update failed") }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordMessage("")
    setPasswordError("")
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPasswordError("New passwords do not match."); return }
    try {
      await changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })
      setPasswordMessage("Password changed successfully.")
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) { setPasswordError(err instanceof Error ? err.message : "Password change failed") }
  }

  return { user, isLoading, fileInputRef, avatarFile, avatarUploading, avatarMessage, avatarError, avatarUrl, profileForm, profileMessage, profileError, passwordForm, passwordMessage, passwordError, handleAvatarChange, handleRemoveAvatar, handleAvatarSubmit, updateProfileField, updatePasswordField, handleProfileSubmit, handlePasswordSubmit }
}
