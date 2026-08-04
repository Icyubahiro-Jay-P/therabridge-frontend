import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: ".",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://localhost:5000",
        ws: true,
      },
    },
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@tanstack/react-query"))
              return "vendor-react-query"
            if (id.includes("lucide-react")) return "vendor-icons"
            if (id.includes("react-router"))
              return "vendor-router"
            if (id.includes("socket.io-client"))
              return "vendor-socketio"
            if (id.includes("@radix-ui") || id.includes("radix-ui"))
              return "vendor-radix"
            if (id.includes("react") || id.includes("scheduler"))
              return "vendor-react"
            if (id.includes("@/")) return "app"
            return "vendor"
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
