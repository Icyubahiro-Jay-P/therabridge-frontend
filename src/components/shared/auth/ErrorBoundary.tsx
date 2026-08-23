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
    if (import.meta.env.DEV) {
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md space-y-4 text-center">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold">Oops! Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-300">
          We encountered an unexpected error. Please try again.
        </p>
        {error && (
          <details className="mt-4 text-left text-sm text-gray-500">
            <summary className="cursor-pointer font-mono">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 dark:bg-gray-800">
              {error.message}
            </pre>
          </details>
        )}
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

/**
 * Higher-order component to wrap a component with error boundary
 */
// eslint-disable-next-line react-refresh/only-export-components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: (error: Error, retry: () => void) => ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}
