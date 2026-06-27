"use client";

import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Inline error surface with optional retry. Pair with TanStack Query's `isError`
 * + `refetch`. Keep copy human; avoid leaking raw error internals to users.
 */
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}
    >
      <div className="bg-destructive/10 text-destructive mb-4 flex size-14 items-center justify-center rounded-full">
        <AlertTriangle className="size-7" aria-hidden />
      </div>
      <h3 className="text-headline-md text-foreground">{title}</h3>
      <p className="text-body-sm text-muted-foreground mt-1.5 max-w-sm">{description}</p>
      {onRetry ? (
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          <RotateCw />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
