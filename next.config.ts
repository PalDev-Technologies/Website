import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Source art is about 1700px wide. Larger sizes only upscale and slow the optimizer.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
