import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5777,
    allowedHosts: ['.eventurelb.online'],
    // proxy: {
    //   "/api": {
    //     target: "https://mapsback.eventurelb.online",
    //     changeOrigin: true,
    //   },
    // },
  },
})

