import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth-store"

export type OnboardingStep = 0 | 1

export function useOnboardingState() {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const uploadAvatar = useAuthStore((state) => state.uploadAvatar)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const navigate = useNavigate()

  const [step, setStep] = useState<OnboardingStep>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState("")
  const [bio, setBio] = useState(user?.bio ?? "")
  const [bioSaving, setBioSaving] = useState(false)
  const [bioError, setBioError] = useState("")

  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${API_BASE_URL}${user.avatar}`
    : ""

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("File size must be less than 5MB")
      return
    }
    if (
      !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
        file.type
      )
    ) {
      setAvatarError("Only image files (JPG, PNG, GIF, WebP) are allowed")
      return
    }
    setAvatarFile(file)
    setAvatarError("")
    const reader = new FileReader()
    reader.onloadend = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleRemoveSelected() {
    setAvatarFile(null)
    setAvatarPreview("")
    if (fileInputRef.current) fileInputRef.current.value = ""
    setAvatarError("")
  }

  async function handleAvatarSave() {
    if (!avatarFile) return
    setAvatarError("")
    setAvatarUploading(true)
    try {
      await uploadAvatar(avatarFile)
      next()
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setAvatarUploading(false)
    }
  }

  async function handleBioSave() {
    setBioError("")
    setBioSaving(true)
    try {
      await updateProfile({ bio: bio.trim() })
      finish()
    } catch (err) {
      setBioError(err instanceof Error ? err.message : "Could not save your bio")
    } finally {
      setBioSaving(false)
    }
  }

  function next() {
    setStep(1)
  }

  function finish() {
    navigate("/")
  }

  return {
    user,
    isLoading,
    step,
    fileInputRef,
    avatarFile,
    avatarPreview,
    avatarUrl,
    avatarUploading,
    avatarError,
    bio,
    bioSaving,
    bioError,
    handleAvatarChange,
    handleRemoveSelected,
    handleAvatarSave,
    handleBioSave,
    next,
    finish,
    setBio,
  }
}
