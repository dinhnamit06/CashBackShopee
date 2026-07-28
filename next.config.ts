import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "down-vn.img.susercontent.com",
      },
      {
        protocol: "https",
        hostname: "cf.shopee.vn",
      },
      {
        protocol: "https",
        hostname: "img.shopee.vn",
      },
    ],
  },
};

export default nextConfig;
