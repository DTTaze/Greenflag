import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import dns from "dns";
dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: "0.0.0.0",
    // strictPort: false,
    // cors: {
    //   origin: "https://greenflag.id.vn",
    //   credentials: true,
    // },
    proxy: {
      "/socket.io": {
        target: "http://localhost:6060",
        ws: true,
        changeOrigin: true,
      },
    },
    cors: {
      origin: ["https://localhost:6060", "http://localhost:6060"],
      credentials: true,
    },
    allowedHosts: ["greenflag.id.vn"],
  },
});
