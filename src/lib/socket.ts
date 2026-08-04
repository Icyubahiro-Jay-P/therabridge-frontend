import { io, type Socket } from "socket.io-client"
import { getAuthToken } from "@/lib/api"

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.DEV
    ? window.location.origin
    : "https://therabridge-backend.onrender.com")

let socket: Socket | null = null

export function getSocket(): Socket | null {
  if (typeof window === "undefined") return null
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: (cb) => cb({ token: getAuthToken() }),
      withCredentials: true,
      transports: ["websocket", "polling"],
    })
  }
  return socket
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}
