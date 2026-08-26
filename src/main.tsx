import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/shared/theme-provider.tsx"
import { ErrorBoundary } from "@/components/shared/auth/ErrorBoundary"
import { TooltipProvider } from "@/components/ui/tooltip"
import { queryClient } from "@/lib/query-client"

createRoot(document.getElementById("root")!).render(
  <>
    <Analytics />
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <TooltipProvider>
            <App />
            <Toaster position="bottom-right" closeButton />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </>
)
