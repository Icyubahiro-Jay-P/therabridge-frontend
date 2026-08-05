import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuthStore } from "@/store/auth-store"
import { STEP_COUNT, STEP_ITEMS, getStepIndex } from "./signupSteps"

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

export function validateField(field: FieldName, value: string, date?: Date): string | undefined {
  if (field === "firstName" || field === "lastName") {
    if (!value.trim() || value.trim().length < 2) {
      return `${field === "firstName" ? "First" : "Last"} name must be at least 2 characters.`
    }
  }

  if (field === "username") {
    if (!value.trim()) return "Username is required."
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(value.trim())) {
      return "Letters, numbers, underscores only (3–30 chars)."
    }
  }

  if (field === "email") {
    if (!value.trim()) return "Email is required."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return "Invalid email format."
    }
  }

  if (field === "dateOfBirth") {
    if (!date) return "Date of birth is required."
    const age = new Date().getFullYear() - date.getFullYear()
    if (age < 18 || age > 120)
      return "You must be between 18 and 120 years old."
  }

  if (field === "password") {
    if (!value) return "Password is required."
    if (value.length < 8) return "Password must be at least 8 characters."
  }

  return undefined
}

export function useSignupState() {
  const register = useAuthStore((state) => state.register)
  const isLoading = useAuthStore((state) => state.isLoading)
  const navigate = useNavigate()
  const { step: stepSlug } = useParams<{ step: string }>()
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "", email: "", password: "", dateOfBirth: "" })
  const [date, setDate] = useState<Date | undefined>()
  const [showPassword, setShowPassword] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})

  const stepIndex = getStepIndex(stepSlug)
  const stepItem = STEP_ITEMS[stepIndex] ?? STEP_ITEMS[0]
  const isLastStep = stepIndex === STEP_COUNT - 1
  const isFirstStep = stepIndex === 0

  useEffect(() => {
    if (stepIndex === -1) {
      navigate(`/signup/${STEP_ITEMS[0].slug}`, { replace: true })
    }
  }, [stepIndex, navigate])

  function goToStep(index: number) {
    const next = Math.min(Math.max(index, 0), STEP_COUNT - 1)
    navigate(`/signup/${STEP_ITEMS[next].slug}`)
  }

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

  // Builds the DOB from day/month/year selects. Returns an empty string until
  // every part is filled and the combination is a real calendar date, so the
  // existing `validateField`/`handleStepSubmit` flow keeps working unchanged.
  function handleDateParts(day: string, month: string, year: string) {
    const d = day ? parseInt(day, 10) : NaN
    const m = month ? parseInt(month, 10) : NaN
    const y = year ? parseInt(year, 10) : NaN

    let date: Date | undefined
    let value = ""
    if (!isNaN(d) && !isNaN(m) && !isNaN(y) && m >= 1 && m <= 12) {
      const daysInMonth = new Date(y, m, 0).getDate()
      if (d >= 1 && d <= daysInMonth && y >= 1900) {
        date = new Date(y, m - 1, d)
        value = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      }
    }

    setDate(date)
    const next = { ...form, dateOfBirth: value }
    setForm(next)
    if (touched.dateOfBirth) setFieldErrors(validate(next))
  }

  async function handleStepSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (stepIndex === -1) return

    const fieldError = validateField(stepItem.field, stepItem.field === "dateOfBirth" ? form.dateOfBirth : form[stepItem.field], date)
    if (fieldError) {
      setTouched((prev) => ({ ...prev, [stepItem.field]: true }))
      setFieldErrors((prev) => ({ ...prev, [stepItem.field]: fieldError }))
      return
    }

    if (!isLastStep) {
      goToStep(stepIndex + 1)
      return
    }

    setFeedback(null)
    const errors = validate(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    try {
      const message = await register(form)
      setFeedback({ type: "success", message })
      window.setTimeout(() => navigate("/"), 900)
    } catch (err) {
      setFeedback({ type: "error", message: err instanceof Error ? err.message : "Registration failed" })
    }
  }

  return {
    form,
    date,
    showPassword,
    feedback,
    fieldErrors,
    isLoading,
    stepIndex,
    stepItem,
    isLastStep,
    isFirstStep,
    updateField,
    handleBlur,
    handleDateParts,
    handleStepSubmit,
    setShowPassword,
    goToStep,
  }
}
