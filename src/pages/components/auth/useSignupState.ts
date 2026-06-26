import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth-store"

export type FieldName = "firstName" | "lastName" | "username" | "email" | "password" | "dateOfBirth"
export type FieldErrors = Partial<Record<FieldName, string>>
export type Feedback = { type: "success" | "error"; message: string }

function validate(form: Record<FieldName, string>): FieldErrors {
  const e: FieldErrors = {}
  if (!form.firstName.trim() || form.firstName.trim().length < 2) e.firstName = "First name must be at least 2 characters."
  if (!form.lastName.trim() || form.lastName.trim().length < 2) e.lastName = "Last name must be at least 2 characters."
  if (!form.username.trim()) e.username = "Username is required."
  else if (!/^[a-zA-Z0-9_]{3,30}$/.test(form.username.trim())) e.username = "Letters, numbers, underscores only (3–30 chars)."
  if (!form.email.trim()) e.email = "Email is required."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Invalid email format."
  if (!form.password) e.password = "Password is required."
  else if (form.password.length < 8) e.password = "Password must be at least 8 characters."
  if (!form.dateOfBirth) e.dateOfBirth = "Date of birth is required."
  else {
    const age = new Date().getFullYear() - new Date(form.dateOfBirth).getFullYear()
    if (age < 18 || age > 120) e.dateOfBirth = "You must be between 18 and 120 years old."
  }
  return e
}

export function useSignupState() {
  const register = useAuthStore((state) => state.register)
  const isLoading = useAuthStore((state) => state.isLoading)
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "", email: "", password: "", dateOfBirth: "" })
  const [date, setDate] = useState<Date | undefined>()
  const [showPassword, setShowPassword] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})

  function updateField(field: FieldName, value: string) {
    setForm((current) => {
      const next = { ...current, [field]: value }
      if (touched[field]) setFieldErrors(validate(next))
      return next
    })
  }

  function handleBlur(field: FieldName) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setFieldErrors(validate(form))
  }

  function handleDateSelect(selectedDate: Date | undefined) {
    setDate(selectedDate)
    const value = selectedDate ? selectedDate.toISOString().split("T")[0] : ""
    const next = { ...form, dateOfBirth: value }
    setForm(next)
    if (touched.dateOfBirth) setFieldErrors(validate(next))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)
    const errors = validate(form)
    setFieldErrors(errors)
    setTouched({ firstName: true, lastName: true, username: true, email: true, password: true, dateOfBirth: true })
    if (Object.keys(errors).length > 0) return
    try {
      const message = await register(form)
      setFeedback({ type: "success", message })
      window.setTimeout(() => navigate("/"), 900)
    } catch (err) {
      setFeedback({ type: "error", message: err instanceof Error ? err.message : "Registration failed" })
    }
  }

  return { form, date, showPassword, feedback, fieldErrors, isLoading, updateField, handleBlur, handleDateSelect, handleSubmit, setShowPassword }
}
