import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Raise the body size limit to allow 4MB resume uploads
      // (adding ~1MB headroom for multipart encoding overhead)
      bodySizeLimit: "5mb",
    },
  },
  // Turbopack is the default bundler in Next.js 16.
  // pdfjs-dist and mammoth are only ever imported via dynamic import()
  // inside Server Actions, so they never enter the client bundle —
  // no special canvas alias is needed in Turbopack mode.
  turbopack: {},
};

export default nextConfig;
