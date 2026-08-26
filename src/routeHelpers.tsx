import { Suspense, useEffect } from "react"
import { Navigate } from "react-router-dom"

import { AppLayout } from "@/components/layout/AppLayout"
import { useAuthStore } from "@/store/auth-store"
import { ErrorBoundary } from "@/components/shared/auth/ErrorBoundary"
import { Skeleton } from "@/components/ui/skeleton"
import { Leaf } from "lucide-react"

import {
  LandingPage,
  AdminDashboardPage,
  TherapistDashboardPage,
  UserHomePage,
} from "./routes"

function RootRoute() {
  const user = useAuthStore((state) => state.user)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  if (!isInitialized) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  if (user.isDisabled) {
    return <Navigate to="/account-disabled" replace />
  }

  if (!user.isAccountVerified) {
    return <Navigate to="/verify-email" replace />
  }

  return (
    <AppLayout>
      {user.role === "admin" ? (
        <AdminDashboardPage />
      ) : user.role === "therapist" ? (
        <TherapistDashboardPage />
      ) : (
        <UserHomePage />
      )}
    </AppLayout>
  )
}

function RequireRole({
  roles,
  children,
}: {
  roles: string[]
  children: React.ReactNode
}) {
  const user = useAuthStore((state) => state.user)
  const role = user?.role ?? "user"

  if (!roles.includes(role)) return <Navigate to="/" replace />
  return <>{children}</>
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  useEffect(() => {
    if (!isInitialized) {
      initialize()
    }
  }, [initialize, isInitialized])

  if (!isInitialized) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-linear-to-br from-emerald-50 to-teal-50 dark:from-gray-950 dark:to-gray-900">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-flex size-12 animate-pulse items-center justify-center rounded-xl bg-emerald-600">
            <Leaf />
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading Therabridge...
          </p>
        </div>
      </div>
    )
  }

  return children
}

function PageSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function RouteErrorFallback({
  retry,
}: {
  error: Error | null
  retry: () => void
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <div className="max-w-md space-y-4 text-center">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-sm text-gray-500">
          This section encountered an error. Please try again.
        </p>
        <button
          onClick={retry}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    </div>
  )
}

const suspenseFallback = <PageSkeleton />

function ErrorBoundaryRoute({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <RouteErrorFallback error={error} retry={retry} />
      )}
    >
      <Suspense fallback={suspenseFallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export {
  RootRoute,
  RequireRole,
  AuthInitializer,
  ErrorBoundaryRoute,
}
