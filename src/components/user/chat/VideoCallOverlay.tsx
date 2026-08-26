import { useEffect, useRef } from "react"
import {
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
  Phone,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CallState } from "./useWebRTC"

interface VideoCallOverlayProps {
  userId: string
  callState: CallState
  peerId: string | null
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  incomingCall: {
    callId: string
    callerId: string
    callerName: string
    callerUsername: string
  } | null
  isMuted: boolean
  isVideoOff: boolean
  acceptCall: () => void
  rejectCall: () => void
  endCall: () => void
  toggleMute: () => void
  toggleVideo: () => void
  partnerName?: string
  partnerAvatar?: string
}

function VideoElement({
  stream,
  muted,
  className,
}: {
  stream: MediaStream | null
  muted: boolean
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const streamRef = useRef(stream)
  streamRef.current = stream

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (stream) {
      el.srcObject = stream
    } else {
      el.srcObject = null
    }

    return () => {
      el.srcObject = null
    }
  }, [stream])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleVisibility = () => {
      if (document.visibilityState === "visible" && streamRef.current) {
        el.play().catch(() => {})
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted={muted}
      className={className}
    />
  )
}

export function VideoCallOverlay({
  callState,
  localStream,
  remoteStream,
  incomingCall,
  isMuted,
  isVideoOff,
  acceptCall,
  rejectCall,
  endCall,
  toggleMute,
  toggleVideo,
  partnerName,
  partnerAvatar,
}: VideoCallOverlayProps) {
  const showOverlay = callState !== "idle"
  if (!showOverlay) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950">
      {/* Remote video - full background */}
      <div className="relative flex-1 overflow-hidden">
        {remoteStream ? (
          <VideoElement
            stream={remoteStream}
            muted={false}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              {partnerAvatar ? (
                <img
                  src={partnerAvatar}
                  alt={partnerName || "Partner"}
                  className="mx-auto mb-4 h-32 w-32 rounded-full object-cover ring-4 ring-white/10"
                />
              ) : (
                <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-white/10 text-5xl font-semibold text-white">
                  {(partnerName || "?")[0]}
                </div>
              )}
              <p className="text-xl font-medium text-white">
                {partnerName || "Unknown"}
              </p>
              <CallStatusText callState={callState} />
            </div>
          </div>
        )}

        {/* Local video - PiP corner */}
        {localStream && (
          <div className="absolute bottom-24 right-4 overflow-hidden rounded-2xl border-2 border-white/20 shadow-lg sm:bottom-28 sm:right-8">
            <VideoElement
              stream={isVideoOff ? null : localStream}
              muted={true}
              className="h-36 w-48 object-cover sm:h-44 sm:w-60"
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <VideoOff className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Incoming call notification */}
      {callState === "ringing" && incomingCall && (
        <div className="absolute inset-x-0 top-0 flex justify-center pt-6">
          <div className="flex items-center gap-4 rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-md">
            <div className="h-10 w-10 animate-pulse rounded-full bg-emerald-500/80" />
            <div>
              <p className="text-sm font-medium text-white">Incoming call</p>
              <p className="text-lg font-semibold text-white">
                {incomingCall.callerName}
              </p>
            </div>
            <Button
              onClick={acceptCall}
              size="icon"
              className="h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              onClick={rejectCall}
              size="icon"
              className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Call controls */}
      <div className="flex items-center justify-center gap-4 bg-black/60 px-4 py-5 backdrop-blur-sm sm:py-6">
        <Button
          onClick={toggleMute}
          size="icon"
          className={`h-14 w-14 rounded-full transition-colors ${
            isMuted
              ? "bg-white/20 text-white hover:bg-white/30"
              : "bg-white text-gray-900 hover:bg-gray-100"
          }`}
        >
          {isMuted ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>

        <Button
          onClick={endCall}
          size="icon"
          className="h-16 w-16 rounded-full bg-red-500 text-white hover:bg-red-600"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>

        <Button
          onClick={toggleVideo}
          size="icon"
          className={`h-14 w-14 rounded-full transition-colors ${
            isVideoOff
              ? "bg-white/20 text-white hover:bg-white/30"
              : "bg-white text-gray-900 hover:bg-gray-100"
          }`}
        >
          {isVideoOff ? (
            <VideoOff className="h-5 w-5" />
          ) : (
            <Video className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  )
}

function CallStatusText({ callState }: { callState: CallState }) {
  const text =
    callState === "calling"
      ? "Calling..."
      : callState === "connecting"
        ? "Connecting..."
        : callState === "ringing"
          ? "Ringing..."
          : callState === "ended"
            ? "Call ended"
            : ""

  return (
    <p className="mt-2 text-sm text-white/60">
      {text && (
        <span className={callState === "ended" ? "" : "animate-pulse"}>
          {text}
        </span>
      )}
    </p>
  )
}
