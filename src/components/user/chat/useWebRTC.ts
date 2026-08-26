import { useState, useRef, useCallback, useEffect } from "react"
import { getSocket } from "@/lib/socket"

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
}

export type CallState =
  | "idle"
  | "calling"
  | "ringing"
  | "connecting"
  | "connected"
  | "ended"

interface IncomingCall {
  callId: string
  callerId: string
  callerName: string
  callerUsername: string
  callerAvatar?: string | null
}

// Mutable ref for values needed inside socket handlers
const callRef = { callId: null as string | null }

export function useWebRTC() {
  const [callState, setCallState] = useState<CallState>("idle")
  const [callId, setCallId] = useState<string | null>(null)
  const [peerId, setPeerId] = useState<string | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const pendingOfferRef = useRef<{ sdp: RTCSessionDescriptionInit; calleeId: string } | null>(null)

  const cleanup = useCallback(() => {
    pcRef.current?.close()
    pcRef.current = null
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    localStreamRef.current = null
    setLocalStream(null)
    setRemoteStream(null)
    setCallId(null)
    setPeerId(null)
    callRef.callId = null
    pendingOfferRef.current = null
    setIsMuted(false)
    setIsVideoOff(false)
  }, [])

  const getLocalStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    localStreamRef.current = stream
    setLocalStream(stream)
    return stream
  }, [])

  const createPeerConnection = useCallback(
    (remoteUserId: string) => {
      const pc = new RTCPeerConnection(ICE_SERVERS)
      pcRef.current = pc

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          getSocket()?.emit("call:ice-candidate", {
            callId: callRef.callId,
            candidate: event.candidate.toJSON(),
            targetId: remoteUserId,
          })
        }
      }

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0])
      }

      pc.onconnectionstatechange = () => {
        if (
          pc.connectionState === "failed" ||
          pc.connectionState === "disconnected"
        ) {
          setCallState("ended")
          cleanup()
        }
      }

      return pc
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // ==================== SOCKET LISTENERS ====================
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleIncoming = ({
      callId: cid,
      callerId,
      callerName,
      callerUsername,
    }: IncomingCall & { callId: string }) => {
      setIncomingCall({ callId: cid, callerId, callerName, callerUsername })
      setCallState("ringing")
      setCallId(cid)
      callRef.callId = cid
      setPeerId(callerId)
    }

    const handleOffer = async ({
      callId: cid,
      sdp,
      callerId,
    }: {
      callId: string
      sdp: RTCSessionDescriptionInit
      callerId: string
    }) => {
      try {
        const stream = await getLocalStream()
        const pc = createPeerConnection(callerId)

        await pc.setRemoteDescription(new RTCSessionDescription(sdp))

        stream.getTracks().forEach((track) => pc.addTrack(track, stream))

        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)

        socket.emit("call:answer", {
          callId: cid,
          sdp: pc.localDescription?.toJSON(),
          callerId,
        })

        setCallState("connecting")
        setCallId(cid)
        callRef.callId = cid
        setPeerId(callerId)
        setIncomingCall(null)
      } catch {
        socket.emit("call:reject", { callId: cid })
        cleanup()
        setCallState("idle")
      }
    }

    const handleAnswer = async ({
      sdp,
    }: {
      callId: string
      sdp: RTCSessionDescriptionInit
    }) => {
      if (!pcRef.current) return
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp))
      setCallState("connected")
    }

    const handleIceCandidate = async ({
      candidate,
    }: {
      callId: string
      candidate: RTCIceCandidateInit
    }) => {
      if (!pcRef.current) return
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate))
      } catch {
        // ICE candidate failure is non-fatal
      }
    }

    const handleCallEnded = () => {
      setCallState("ended")
      cleanup()
    }

    const handleCallRejected = () => {
      setCallState("ended")
      cleanup()
    }

    const handleCallBusy = () => {
      setCallState("ended")
      cleanup()
    }

    const handleCallMissed = () => {
      setCallState("ended")
      cleanup()
    }

    const handleCallInitiated = ({ callId: cid }: { callId: string }) => {
      setCallId(cid)
      callRef.callId = cid
      setCallState("ringing")

      // Send the pending SDP offer now that we have the callId
      if (pendingOfferRef.current) {
        const { sdp, calleeId } = pendingOfferRef.current
        socket.emit("call:offer", { callId: cid, sdp, calleeId })
        pendingOfferRef.current = null
      }
    }

    socket.on("call:incoming", handleIncoming)
    socket.on("call:offer", handleOffer)
    socket.on("call:answer", handleAnswer)
    socket.on("call:ice-candidate", handleIceCandidate)
    socket.on("call:ended", handleCallEnded)
    socket.on("call:rejected", handleCallRejected)
    socket.on("call:busy", handleCallBusy)
    socket.on("call:missed", handleCallMissed)
    socket.on("call:initiated", handleCallInitiated)

    return () => {
      socket.off("call:incoming", handleIncoming)
      socket.off("call:offer", handleOffer)
      socket.off("call:answer", handleAnswer)
      socket.off("call:ice-candidate", handleIceCandidate)
      socket.off("call:ended", handleCallEnded)
      socket.off("call:rejected", handleCallRejected)
      socket.off("call:busy", handleCallBusy)
      socket.off("call:missed", handleCallMissed)
      socket.off("call:initiated", handleCallInitiated)
    }
  }, [cleanup, createPeerConnection, getLocalStream])

  // End call and clean up resources when the hook unmounts (e.g. navigation away)
  useEffect(() => {
    return () => {
      if (callRef.callId) {
        getSocket()?.emit("call:end", { callId: callRef.callId })
      }
      pcRef.current?.close()
      pcRef.current = null
      localStreamRef.current?.getTracks().forEach((t) => t.stop())
      localStreamRef.current = null
    }
  }, [])

  // ==================== ACTIONS ====================
  const startCall = useCallback(
    async (targetUserId: string) => {
      try {
        const stream = await getLocalStream()
        const pc = createPeerConnection(targetUserId)

        stream.getTracks().forEach((track) => pc.addTrack(track, stream))

        setPeerId(targetUserId)
        setCallState("calling")

        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        pendingOfferRef.current = {
          sdp: pc.localDescription!.toJSON(),
          calleeId: targetUserId,
        }

        getSocket()?.emit("call:initiate", { calleeId: targetUserId })
      } catch {
        cleanup()
        setCallState("idle")
      }
    },
    [getLocalStream, createPeerConnection, cleanup],
  )

  const acceptCall = useCallback(() => {
    if (!incomingCall) return
    // The offer arrives via socket handleOffer which sets up the peer connection
    // This just transitions the UI state
    setCallState("connecting")
  }, [incomingCall])

  const rejectCall = useCallback(() => {
    if (!incomingCall) return
    getSocket()?.emit("call:reject", {
      callId: incomingCall.callId,
      callerId: incomingCall.callerId,
    })
    setIncomingCall(null)
    setCallState("idle")
  }, [incomingCall])

  const endCall = useCallback(() => {
    if (callRef.callId) {
      getSocket()?.emit("call:end", { callId: callRef.callId })
    }
    setCallState("ended")
    cleanup()
  }, [cleanup])

  const toggleMute = useCallback(() => {
    localStreamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled
    })
    setIsMuted((m) => !m)
  }, [])

  const toggleVideo = useCallback(() => {
    localStreamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled
    })
    setIsVideoOff((v) => !v)
  }, [])

  // Reset ended state after a brief delay
  useEffect(() => {
    if (callState === "ended") {
      const timer = setTimeout(() => setCallState("idle"), 1500)
      return () => clearTimeout(timer)
    }
  }, [callState])

  return {
    callState,
    callId,
    peerId,
    localStream,
    remoteStream,
    incomingCall,
    isMuted,
    isVideoOff,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
  }
}
