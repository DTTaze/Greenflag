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
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-router-dom": path.resolve(
        __dirname,
        "src/utils/react-router-dom-shim.tsx",
      ),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "react-router-dom": "./src/utils/react-router-dom-shim.tsx",
    },
  },
};

export default nextConfig;
