import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth-store"

export type FieldErrors = Partial<Record<"identifier" | "password", string>>
export type Feedback = { type: "success" | "error"; message: string }

function validate(identifier: string, password: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!identifier.trim()) errors.identifier = "Email or username is required."
  if (!password) errors.password = "Password is required."
  else if (password.length < 8) errors.password = "Password must be at least 8 characters."
  return errors
}

export function useLoginState() {
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<"identifier" | "password", boolean>>>({})

  function handleBlur(field: keyof FieldErrors) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setFieldErrors(validate(identifier, password))
  }

  function handleIdentifierChange(value: string) {
    setIdentifier(value)
    if (touched.identifier) setFieldErrors(validate(value, password))
  }

  function handlePasswordChange(value: string) {
    setPassword(value)
    if (touched.password) setFieldErrors(validate(identifier, value))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)
    const errors = validate(identifier, password)
    setFieldErrors(errors)
    setTouched({ identifier: true, password: true })
    if (Object.keys(errors).length > 0) return
    try {
      const message = await login({ identifier, password })
      setFeedback({ type: "success", message })
      setTimeout(() => navigate("/", { replace: true }), 900)
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Login failed",
      })
    }
  }

  return {
    identifier, password, showPassword, feedback, fieldErrors, isLoading,
    handleIdentifierChange, handlePasswordChange, handleBlur, handleSubmit, setShowPassword,
  }
}
