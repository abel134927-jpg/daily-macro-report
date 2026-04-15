import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/daily-macro-report",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
