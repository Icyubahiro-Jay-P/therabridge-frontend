export function toDateInputValue(value?: string) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().slice(0, 10)
}

export interface ProfileForm {
  firstName: string
  lastName: string
  dateOfBirth: string
  bio: string
}
