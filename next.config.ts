import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_OUTPUT === "export";
// Only needed when the site is served from a sub-path (e.g. GitHub Pages
// project sites: https://user.github.io/portfolio/). Leave unset elsewhere.
const basePath = process.env.NEXT_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The preview proxy serves the dev server from a *.e2b.app origin.
  allowedDevOrigins: ["*.e2b.app", "*.arena.ai"],
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  // `npm run build:static` produces a plain folder of HTML for GitHub Pages,
  // Cloudflare Pages or any static host. Vercel/Netlify should use the default.
  ...(isStaticExport
    ? { output: "export" as const, images: { unoptimized: true } }
    : {}),
};

export default nextConfig;
