import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // Wildcard domain
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
