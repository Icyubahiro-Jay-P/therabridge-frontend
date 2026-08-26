import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/shared/theme-provider.tsx"
import { ErrorBoundary } from "@/components/shared/auth/ErrorBoundary"
import { TooltipProvider } from "@/components/ui/tooltip"
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider"
import { queryClient } from "@/lib/query-client"

createRoot(document.getElementById("root")!).render(
  <>
    <Analytics />
    <SpeedInsights />
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <BrowserRouter>
            <TooltipProvider>
              <OnboardingProvider>
                <App />
              </OnboardingProvider>
              <Toaster position="bottom-right" closeButton />
            </TooltipProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </>
)
