import { useState, useRef, useEffect } from "react"
import { CheckCheck, Loader2, Mic, PencilLine, Reply, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CharCounter } from "@/components/ui/char-counter"
import { cn } from "@/lib/utils"
import { LIMITS } from "@/lib/limits"
import { VoiceRecorder } from "./VoiceRecorder"

export function MessageInput({
  value,
  onChange,
  onSend,
  onSendVoice,
  sending,
  placeholder,
  enterToSend = true,
  editing = false,
  onCancelEdit,
  disabled = false,
  maxLength = LIMITS.message.dm,
  replyTo,
  onCancelReply,
}: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  onSendVoice?: (blob: Blob, duration: number) => void
  sending: boolean
  placeholder?: string
  enterToSend?: boolean
  editing?: boolean
  onCancelEdit?: () => void
  disabled?: boolean
  maxLength?: number
  replyTo?: {
    senderUsername: string
    content: string
    type?: string
  } | null
  onCancelReply?: () => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }
  }, [value])

  const canRecord = !!onSendVoice && !editing
  const showMic = canRecord && !value.trim() && !recording
  const showSend = !!value.trim() || editing

  return (
    <div className="border-t border-gray-200 px-4 py-3.5 dark:border-gray-700/60">
      {replyTo && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 dark:border-emerald-700/70 dark:bg-emerald-950/40">
          <p className="flex items-center gap-1.5 truncate text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <Reply className="size-3.5 shrink-0" />
            <span className="truncate">
              Replying to <span className="font-bold">{replyTo.senderUsername}</span>
              {" — "}
              {replyTo.type === "voice" ? "Voice message" : replyTo.content}
            </span>
          </p>
          <button
            type="button"
            onClick={onCancelReply}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
      {editing && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-teal-300 bg-teal-50 px-3 py-2 dark:border-teal-700/70 dark:bg-teal-950/40">
          <p className="flex items-center gap-1.5 text-xs font-medium text-teal-700 dark:text-teal-300">
            <PencilLine className="size-3.5" /> Editing message
          </p>
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100 dark:text-teal-300 dark:hover:bg-teal-900/40"
          >
            <X className="size-3.5" /> Cancel
          </button>
        </div>
      )}
      {recording ? (
        <VoiceRecorder
          onRecordingComplete={(blob, duration) => {
            setRecording(false)
            if (onSendVoice) {
              onSendVoice(blob, duration)
            }
          }}
          onCancel={() => setRecording(false)}
          sending={sending}
        />
      ) : (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSend()
            }}
            className="flex items-end gap-2"
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
              placeholder={editing ? "Edit your message..." : (placeholder ?? "Type a message...")}
              disabled={sending || disabled}
              rows={1}
              maxLength={maxLength}
              aria-label={editing ? "Edit message" : "Message"}
              className={cn(
                "flex-1 resize-none rounded-xl border px-3 py-2 text-base outline-none transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&::-webkit-scrollbar]:hidden scrollbar-none",
                editing
                  ? "border-teal-400 bg-teal-50/70 placeholder:text-teal-700/60 focus-visible:border-teal-500 focus-visible:ring-[3px] focus-visible:ring-teal-500/30 dark:border-teal-700 dark:bg-teal-950/30 dark:placeholder:text-teal-300/50"
                  : "border-input bg-input/30 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              )}
              onKeyDown={(e) => {
                if (enterToSend && e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  onSend()
                }
                if (!enterToSend && e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault()
                  onSend()
                }
              }}
            />
            {showSend ? (
              <Button
                type="submit"
                disabled={sending || disabled || !value.trim()}
                className={cn(
                  "mb-0.5 shrink-0",
                  editing
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                )}
                size="icon"
              >
                {sending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : editing ? (
                  <CheckCheck className="size-4" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            ) : showMic ? (
              <Button
                type="button"
                onClick={() => setRecording(true)}
                disabled={disabled}
                className="mb-0.5 shrink-0 bg-emerald-600 hover:bg-emerald-700"
                size="icon"
              >
                <Mic className="size-4" />
              </Button>
            ) : null}
          </form>
          <div className="mt-1.5 flex justify-end">
            <CharCounter count={value.length} limit={maxLength} />
          </div>
        </>
      )}
    </div>
  )
}
