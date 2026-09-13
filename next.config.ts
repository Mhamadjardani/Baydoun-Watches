import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "http://localhost:3000",
    "192.168.1.103",
    "127.0.0.1",
    "http://127.0.0.1:3000",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vdvpakmvwxqluewztbfk.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
