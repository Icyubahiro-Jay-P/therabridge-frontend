import { Link } from "react-router-dom"
import { ArrowRight, Heart, Shield, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuthStore } from "@/store/auth-store"

function formatDate(value?: string) {
  if (!value) return "Not set"

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function HomePage() {
  const user = useAuthStore((state) => state.user)

  if (!user) return null

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-linear-to-br from-emerald-600 to-emerald-700 p-8 text-white shadow-lg">
        <p className="text-sm font-medium text-emerald-100">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Hi, {user.firstName}
        </h1>
        <p className="mt-3 max-w-2xl text-emerald-50">
          You&apos;re signed in as @{user.username}. Explore your profile, update
          your details, and continue building your wellness routine with
          Therabridge.
        </p>
        <Button asChild variant="secondary" className="mt-6">
          <Link to="/profile">
            View profile
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-600" />
              Account
            </CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Name:</span>{" "}
              {user.firstName} {user.lastName}
            </p>
            <p>
              <span className="text-muted-foreground">Email:</span> {user.email}
            </p>
            <p>
              <span className="text-muted-foreground">Role:</span>{" "}
              <span className="capitalize">{user.role}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="size-4 text-emerald-600" />
              Wellness
            </CardTitle>
            <CardDescription>Your journey starts here</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Exercises, chat, and community features are available through the
            backend API and ready to be connected next.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-4 text-emerald-600" />
              Security
            </CardTitle>
            <CardDescription>Session protected by cookie auth</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Your session is managed securely with an httpOnly JWT cookie from the
            backend. Update your password anytime from your profile page.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile snapshot</CardTitle>
          <CardDescription>Information loaded from your backend profile</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted-foreground">Username:</span> @{user.username}
          </p>
          <p>
            <span className="text-muted-foreground">Date of birth:</span>{" "}
            {formatDate(user.dateOfBirth)}
          </p>
          <p className="sm:col-span-2">
            <span className="text-muted-foreground">Bio:</span>{" "}
            {user.bio?.trim() ? user.bio : "No bio added yet."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
