import { Link } from "react-router-dom"

export function AuthFooter() {
  return (
    <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
      Already have an account?{" "}
      <Link to="/login" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
        Sign in
      </Link>
    </p>
  )
}
