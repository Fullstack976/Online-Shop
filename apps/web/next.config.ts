import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Shared workspace package is shipped as TypeScript source.
  transpilePackages: ["@shop/db"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Product images uploaded from the admin to Supabase Storage.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
