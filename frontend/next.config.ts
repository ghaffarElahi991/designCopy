import type { NextConfig } from "next";

const backendApiUrl = process.env.API_URL || "http://127.0.0.1:4000/api";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["168.231.126.220", "silkshadow.store", "www.silkshadow.store"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendApiUrl}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pub-4283f8432e864f27a5b1fc3026b6ef06.r2.dev",
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ["**/node_modules/**", "**/.git/**"],
      };
    }
    return config;
  },
};

export default nextConfig;
