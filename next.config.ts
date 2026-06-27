import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/**
 * Production Next.js configuration.
 *
 * - `reactStrictMode` surfaces unsafe lifecycles early.
 * - `outputFileTracingRoot` pins the workspace root to THIS app, so output
 *   tracing isn't confused by unrelated lockfiles elsewhere on the machine.
 * - Build is intentionally NOT allowed to pass with lint/type errors.
 * - `images.remotePatterns` whitelists the backend media origin (local disk in
 *   dev via STORAGE_PUBLIC_URL, S3/MinIO in prod). Extend per environment.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: projectRoot,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      // Backend-served media (local disk dev): http://localhost:3000/uploads/**
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "3000", pathname: "/**" },
      // S3 / MinIO / CDN origins are added per-environment via env-driven config.
    ],
  },
};

export default nextConfig;
