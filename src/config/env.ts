import { z } from "zod";

/**
 * Type-safe, validated environment access.
 *
 * Why this exists: a missing/typo'd env var should fail loudly at boot, not
 * surface as an undefined `baseURL` deep inside a request. Client vars MUST be
 * referenced as literal `process.env.NEXT_PUBLIC_*` so Next.js can inline them
 * into the browser bundle.
 *
 * - Client schema  → safe to read anywhere (only `NEXT_PUBLIC_*`).
 * - Server schema  → validated lazily, server-only (BFF route handlers, SSR).
 */

const clientSchema = z.object({
  /** Backend REST base, e.g. http://localhost:3000/api/v1 (client → backend for data). */
  NEXT_PUBLIC_API_URL: z.string().url(),
  /** This app's public origin, e.g. http://localhost:3001. */
  NEXT_PUBLIC_APP_URL: z.string().url(),
  /** Display name used in metadata / chrome. */
  NEXT_PUBLIC_SITE_NAME: z.string().min(1).default("BuyHat"),
});

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  /** Backend base used server-side by BFF route handlers / SSR fetches. */
  BACKEND_API_URL: z.string().url(),
});

function formatIssues(error: z.ZodError): string {
  return error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
}

const clientParsed = clientSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
});

if (!clientParsed.success) {
  throw new Error(`❌ Invalid public environment variables:\n${formatIssues(clientParsed.error)}`);
}

export const clientEnv = clientParsed.data;

/**
 * Server env is resolved on demand so importing `clientEnv` in a client
 * component never drags server-only validation into the browser bundle.
 */
let cachedServerEnv: z.infer<typeof serverSchema> | null = null;

export function getServerEnv(): z.infer<typeof serverSchema> {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must not be called in the browser.");
  }
  if (cachedServerEnv) return cachedServerEnv;

  const parsed = serverSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    BACKEND_API_URL: process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL,
  });

  if (!parsed.success) {
    throw new Error(`❌ Invalid server environment variables:\n${formatIssues(parsed.error)}`);
  }

  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}

/** Convenience for non-throwing checks. */
export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";
