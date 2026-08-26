import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@tomato/icon", "@tomato/grid"],
};

export default nextConfig;
