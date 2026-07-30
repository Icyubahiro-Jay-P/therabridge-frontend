import type { ReactNode } from "react"
import * as RadixTooltip from "@radix-ui/react-tooltip"

interface TooltipProps {
  content: string | ReactNode
  children: ReactNode
  side?: "top" | "bottom" | "left" | "right"
  delayDuration?: number
}

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <RadixTooltip.Provider delayDuration={200}>{children}</RadixTooltip.Provider>
}

export function Tooltip({ content, children, side = "top", delayDuration = 200 }: TooltipProps) {
  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={4}
          className="z-50 rounded-md bg-gray-800 px-2.5 py-1.5 text-xs text-white shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 dark:bg-gray-200 dark:text-gray-800"
        >
          {content}
          <RadixTooltip.Arrow className="fill-gray-800 dark:fill-gray-200" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}

export function TooltipIcon({ icon: Icon, tooltip, ...props }: any) {
  return (
    <Tooltip content={tooltip}>
      <button type="button" {...props}>
        <Icon />
      </button>
    </Tooltip>
  )
}
