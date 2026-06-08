import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  pageExtensions: ["tsx", "ts"],
  env: {
    VITE_BACKEND_URL: process.env.VITE_BACKEND_URL || "http://localhost:6060",
    VITE_GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID || "",
    VITE_GOOGLE_REDIRECT_URI: process.env.VITE_GOOGLE_REDIRECT_URI || "",
    VITE_GOOGLE_SCOPE: process.env.VITE_GOOGLE_SCOPE || "",
  },
  async rewrites() {
    const backendUrl = process.env.VITE_BACKEND_URL || "http://localhost:6060";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/socket.io/:path*",
        destination: `${backendUrl}/socket.io/:path*`,
      },
    ];
  },
};

export default nextConfig;
