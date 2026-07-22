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
  trailingSlash: true,
  rewrites: async () => {
    return [
      {
        source: "/experiments/:path*",
        destination: "/experiments/:path*/index.html",
      },
      {
        source: "/wordgraph",
        destination: "/experiments/word-graph/index.html",
      },
      {
        source: "/wordgraph/:path*",
        destination: "/experiments/word-graph/:path*",
      },
    ];
  },
};

export default nextConfig;
