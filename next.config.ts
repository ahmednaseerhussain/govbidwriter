import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],
  experimental: {
    serverActions: {
      // RFP PDF uploads go through a server action; allow up to ~10MB files.
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
