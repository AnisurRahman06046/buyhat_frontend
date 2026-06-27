import { Loader2 } from "lucide-react";

import { cn } from "@/lib/cn";

/**
 * Accessible loading spinner. Announces "Loading" to assistive tech via an
 * sr-only label; the icon itself is decorative.
 */
export function Spinner({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-live="polite" className="inline-flex">
      <Loader2 className={cn("text-muted-foreground size-5 animate-spin", className)} aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}
