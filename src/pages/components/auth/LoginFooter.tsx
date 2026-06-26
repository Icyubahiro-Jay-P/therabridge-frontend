import { Link } from "react-router-dom"

export function LoginFooter() {
  return (
    <>
      <div className="mt-4 text-right">
        <Link
          to="/forgot-password"
          className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Forgot password?
        </Link>
      </div>
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Create one
        </Link>
      </p>
    </>
  )
}
