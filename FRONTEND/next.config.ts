import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const nextIntlPlugin = createNextIntlPlugin();

const nextConfig: NextConfig = {
  pageExtensions: ["tsx", "ts"],
  env: {
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV || "development",
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3030/api/v1",
  },
};

export default nextIntlPlugin(nextConfig);
