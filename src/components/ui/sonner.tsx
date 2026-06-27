"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * App toast surface (sonner), themed via tokens. Rendered once in AppProviders;
 * trigger with `toast.success(...)` / `toast.error(...)` from anywhere.
 */
export function Toaster({ ...props }: ToasterProps) {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "rounded-lg border border-border bg-card text-card-foreground shadow-card-hover",
          description: "text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}
