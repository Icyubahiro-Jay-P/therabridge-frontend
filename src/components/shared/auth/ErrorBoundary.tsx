import React from "react"
import type { ReactNode } from "react"
import { AlertCircle } from "lucide-react"
import { describeError, IS_DEV } from "@/lib/errors"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary Component
 * Catches errors in child components and displays a user-friendly message
 * Prevents entire app from crashing due to a single component error
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    if (IS_DEV) {
      console.error("Error caught by Error Boundary:", error)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ? (
        this.props.fallback(this.state.error!, this.handleRetry)
      ) : (
        <DefaultErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}

/**
 * Default error UI when error boundary catches an error
 */
function DefaultErrorFallback({
  error,
  onRetry,
}: {
  error: Error | null
  onRetry: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-md space-y-4 rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Oops! Something went wrong
        </h2>
        <p className="text-muted-foreground">
          We encountered an unexpected error. Please try again.
        </p>
        {error && IS_DEV && (
          <details className="mt-4 text-left text-sm text-muted-foreground">
            <summary className="cursor-pointer font-mono">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-foreground">
              {describeError(error)}
            </pre>
          </details>
        )}
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

