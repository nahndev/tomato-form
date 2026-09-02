import type { NextConfig } from "next";

const SERVER_API_URL = process.env.SERVER_API_URL ?? "http://localhost:3022";
const STORAGE_API_URL = process.env.STORAGE_API_URL ?? "http://localhost:3023";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@tomato/icon", "@tomato/grid"],
  async rewrites() {
    return [
      {
        source: "/api/storage/:path*",
        destination: `${STORAGE_API_URL}/api/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${SERVER_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
