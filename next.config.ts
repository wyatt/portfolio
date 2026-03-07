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
    ];
  },
};

export default nextConfig;
