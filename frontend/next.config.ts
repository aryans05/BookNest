import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      // World of Books (main)
      {
        protocol: "https",
        hostname: "image-server.worldofbooks.com",
      },

      // World of Rare Books (used by scraped products)
      {
        protocol: "https",
        hostname: "images.worldofrarebooks.co.uk",
      },

      // Fallback / other WoB image CDN
      {
        protocol: "https",
        hostname: "images.worldofbooks.com",
      },
    ],
  },
};

export default nextConfig;
