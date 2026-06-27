import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names while resolving Tailwind conflicts.
 * `cn("px-2", isLg && "px-4")` → `"px-4"` (later wins, no duplicates).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
