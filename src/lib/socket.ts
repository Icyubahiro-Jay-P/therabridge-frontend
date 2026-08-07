import { io, type Socket } from "socket.io-client"

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || window.location.origin

let socket: Socket | null = null

function createSocket(): Socket {
  // Auth comes from the httpOnly cookie the browser attaches via
  // withCredentials; no token is passed or stored client-side.
  const s = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  })
  s.on("connect_error", (err) => {
    if (err?.message === "unauthorized" || err?.message === "disabled") {
      s.disconnect()
      socket = null
    }
  })
  return s
}

export function connectSocket(): Socket | null {
  if (typeof window === "undefined") return null
  if (!socket || !socket.connected) {
    socket?.disconnect()
    socket = createSocket()
  }
  return socket
}

export function getSocket(): Socket | null {
  if (typeof window === "undefined") return null
  if (!socket) {
    socket = createSocket()
  }
  return socket
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}
