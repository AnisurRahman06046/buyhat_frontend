"use client";

import { useEffect, useState } from "react";

/**
 * `true` only after the first client render. Use to gate client-only UI (e.g.
 * theme-dependent or `Date`-dependent output) and avoid hydration mismatches.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
