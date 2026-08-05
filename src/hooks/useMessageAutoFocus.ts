import { useEffect, useRef } from "react"

function isFormField(el: Element | null): boolean {
  if (!el) return false
  if (el instanceof HTMLElement && el.isContentEditable) return true
  const tag = el.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT"
}

export interface UseMessageAutoFocusOptions {
  /** Current value of the input, used to detect post-send clearing. */
  value: string
  /** While true (e.g. a send is in flight) the input is not focusable. */
  disabled?: boolean
  /** Refocus when the value goes from non-empty to empty (post-send / cancel). */
  refocusOnClear?: boolean
  /** Refocus when the window/tab regains focus and no other field is active. */
  refocusOnWindowFocus?: boolean
  /** Refocus after a click that landed outside another form field. */
  refocusOnDocumentClick?: boolean
}

/**
 * Keeps a message composer focused at all times: on load, while typing,
 * when the page/window regains focus or the user clicks empty space
 * ("not typing"), and right after a message is sent (the value clears).
 * Never steals focus away from another input/select/contenteditable.
 */
export function useMessageAutoFocus<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  {
    value,
    disabled = false,
    refocusOnClear = true,
    refocusOnWindowFocus = true,
    refocusOnDocumentClick = true,
  }: UseMessageAutoFocusOptions,
) {
  const prevValueRef = useRef(value)
  const prevDisabledRef = useRef(disabled)

  const focus = () => {
    if (!disabled) ref.current?.focus()
  }

  useEffect(() => {
    if (disabled) return
    ref.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (disabled || !refocusOnWindowFocus) return
    const onWindowFocus = () => {
      if (!isFormField(document.activeElement)) ref.current?.focus()
    }
    window.addEventListener("focus", onWindowFocus)
    return () => window.removeEventListener("focus", onWindowFocus)
  }, [disabled, refocusOnWindowFocus, ref])

  useEffect(() => {
    if (disabled || !refocusOnDocumentClick) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target || target.closest("textarea, input, select, [contenteditable]")) return
      if (target === ref.current) return
      if (!isFormField(document.activeElement)) ref.current?.focus()
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [disabled, refocusOnDocumentClick, ref])

  useEffect(() => {
    const prevValue = prevValueRef.current
    const prevDisabled = prevDisabledRef.current
    prevValueRef.current = value
    prevDisabledRef.current = disabled

    const justCleared = prevValue.length > 0 && value.length === 0
    const becameEnabled = prevDisabled && !disabled
    if (refocusOnClear && value.length === 0 && (justCleared || becameEnabled)) {
      focus()
    }
  })
}
