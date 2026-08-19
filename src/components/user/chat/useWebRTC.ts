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
}

export function useWebRTC(userId: string) {
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

  const cleanup = useCallback(() => {
    pcRef.current?.close()
    pcRef.current = null
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    localStreamRef.current = null
    setLocalStream(null)
    setRemoteStream(null)
    setCallId(null)
    setPeerId(null)
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
            callId: callIdRef.current,
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

  // Ref to always have latest callId in socket handlers
  const callIdRef = useRef<string | null>(null)
  callIdRef.current = callId

  const peerIdRef = useRef<string | null>(null)
  peerIdRef.current = peerId

  // ==================== SOCKET LISTENERS ====================
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleIncoming = async ({
      callId: cid,
      callerId,
      callerName,
      callerUsername,
    }: IncomingCall & { callId: string }) => {
      setIncomingCall({ callId: cid, callerId, callerName, callerUsername })
      setCallState("ringing")
      setCallId(cid)
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
      setPeerId(callerId)
      setIncomingCall(null)
    }

    const handleAnswer = async ({
      sdp,
    }: {
      callId: string
      sdp: RTCSessionDescriptionInit
    }) => {
      if (!pcRef.current) return
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp))
      setCallState("connecting")
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

    const handleCallInitiated = ({ callId: cid }: { callId: string }) => {
      setCallId(cid)
      setCallState("ringing")
    }

    socket.on("call:incoming", handleIncoming)
    socket.on("call:offer", handleOffer)
    socket.on("call:answer", handleAnswer)
    socket.on("call:ice-candidate", handleIceCandidate)
    socket.on("call:ended", handleCallEnded)
    socket.on("call:rejected", handleCallRejected)
    socket.on("call:busy", handleCallBusy)
    socket.on("call:initiated", handleCallInitiated)

    return () => {
      socket.off("call:incoming", handleIncoming)
      socket.off("call:offer", handleOffer)
      socket.off("call:answer", handleAnswer)
      socket.off("call:ice-candidate", handleIceCandidate)
      socket.off("call:ended", handleCallEnded)
      socket.off("call:rejected", handleCallRejected)
      socket.off("call:busy", handleCallBusy)
      socket.off("call:initiated", handleCallInitiated)
    }
  }, [cleanup, createPeerConnection, getLocalStream])

  // ==================== ACTIONS ====================
  const startCall = useCallback(
    async (targetUserId: string) => {
      const stream = await getLocalStream()
      const pc = createPeerConnection(targetUserId)

      stream.getTracks().forEach((track) => pc.addTrack(track, stream))

      setPeerId(targetUserId)
      setCallState("calling")

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      getSocket()?.emit("call:initiate", { calleeId: targetUserId })
    },
    [getLocalStream, createPeerConnection],
  )

  const acceptCall = useCallback(async () => {
    if (!incomingCall) return
    // The actual connection happens when we receive the offer via socket
    // This just accepts the incoming notification
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
    if (callId) {
      getSocket()?.emit("call:end", { callId })
    }
    setCallState("ended")
    cleanup()
  }, [callId, cleanup])

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
