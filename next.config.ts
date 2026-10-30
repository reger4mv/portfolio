import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The preview proxy serves the dev server from a *.e2b.app origin.
  allowedDevOrigins: ["*.e2b.app", "*.arena.ai"],
};

export default nextConfig;
