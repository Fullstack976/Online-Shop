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
  experimental: {
    serverActions: {
      // Product image uploads go through a Server Action (4 MB max per file + multipart overhead).
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
