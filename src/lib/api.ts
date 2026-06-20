import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * Extract a human-readable error message from any thrown value.
 * Handles Axios errors (API errors + network errors), generic Errors, and strings.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // The backend returned a response (4xx / 5xx)
    if (error.response) {
      const data = error.response.data as
        | { message?: string; error?: string }
        | undefined
      return (
        data?.message ??
        data?.error ??
        `Server error (${error.response.status})`
      )
    }

    // No response — network / CORS / server down
    if (error.request) {
      return "Cannot reach the server. Make sure the backend is running on port 5000."
    }

    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return "Something went wrong. Please try again."
}
