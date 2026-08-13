import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth-store"
import { resendVerification, verifyEmail } from "@/lib/auth-api"

export const VERIFY_CODE_LENGTH = 6

export function useVerifyEmailState() {
  const user = useAuthStore((state) => state.user)
  const markVerified = useAuthStore((state) => state.markVerified)
  const navigate = useNavigate()

  const [digits, setDigits] = useState<string[]>(
    Array(VERIFY_CODE_LENGTH).fill("")
  )
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => {
      setResendCooldown((current) => current - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  const code = digits.join("")
  const isComplete = code.length === VERIFY_CODE_LENGTH

  function setDigit(index: number, value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 1)
    setDigits((prev) => {
      const next = [...prev]
      next[index] = cleaned
      return next
    })
  }

  // Returns how many digits were placed so the caller can focus the next box.
  function handlePaste(pasted: string): number {
    const cleaned = pasted.replace(/\D/g, "").slice(0, VERIFY_CODE_LENGTH)
    if (!cleaned) return 0
    setDigits(() => {
      const next = Array(VERIFY_CODE_LENGTH).fill("")
      for (let i = 0; i < cleaned.length; i++) next[i] = cleaned[i]
      return next
    })
    return cleaned.length
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isComplete || loading) return
    setLoading(true)
    setError(null)
    try {
      await verifyEmail(code)
      markVerified()
      setSuccess(true)
      window.setTimeout(() => navigate("/onboarding"), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
      setDigits(Array(VERIFY_CODE_LENGTH).fill(""))
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (resending || resendCooldown > 0) return
    setResending(true)
    setError(null)
    try {
      const cooldown = await resendVerification()
      setResendCooldown(cooldown || 60)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend the code")
    } finally {
      setResending(false)
    }
  }

  return {
    user,
    digits,
    code,
    isComplete,
    loading,
    resending,
    error,
    success,
    resendCooldown,
    setDigit,
    handlePaste,
    handleSubmit,
    handleResend,
  }
}
