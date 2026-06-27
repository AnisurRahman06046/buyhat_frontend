import { AlertTriangle } from "lucide-react";

import type { Cart } from "@/types/cart";

/** Surfaced when any line changed price or went out of stock since it was added. */
export function CartRevalidationBanner({ cart }: { cart: Cart }) {
  const hasIssue = cart.items.some((item) => item.outOfStock || item.priceChanged);
  if (!hasIssue) return null;

  return (
    <div
      role="status"
      className="border-warning/30 bg-warning/10 text-warning mt-4 flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>
        Some items changed in price or availability. Please review your cart before checkout.
      </span>
    </div>
  );
}
