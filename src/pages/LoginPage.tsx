import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/auth-store"
import { ModeToggle } from "@/components/mode-toggle"

export function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    try {
      await login({ identifier, password })
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    }
  }

  return (
    <Card>
      {/* circle theme change button in the top-right corner */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in with your email or username to continue.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error ? (
            <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="identifier">Email or username</Label>
            <Input
              id="identifier"
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4 space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <Button
            type="submit"
            className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Create one
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
