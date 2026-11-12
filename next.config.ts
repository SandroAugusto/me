import type { NextConfig } from "next";

// The site is plain content, so it is exported to static files and served from a CDN.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default config;
