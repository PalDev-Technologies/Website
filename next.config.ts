import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  images: {
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
