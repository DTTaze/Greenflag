import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const nextIntlPlugin = createNextIntlPlugin();

const nextConfig: NextConfig = {
  pageExtensions: ["tsx", "ts"],
  env: {
    NEXT_PUBLIC_NESTJS_API_URL:
      process.env.NEXT_PUBLIC_NESTJS_API_URL || "http://localhost:3030",
  },
  async rewrites() {
    const nestjsApiUrl =
      process.env.NEXT_PUBLIC_NESTJS_API_URL || "http://localhost:3030";
    return [
      {
        source: "/nestjs/:path*",
        destination: `${nestjsApiUrl}/:path*`,
      },
    ];
  },
};

export default nextIntlPlugin(nextConfig);
