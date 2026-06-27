import type { Cart } from "@/types/cart";

/** Total units across all lines (for the header badge). */
export function cartItemCount(cart?: Cart | null): number {
  if (!cart) return 0;
  if (cart.items?.length) {
    return cart.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  }
  return cart.itemCount ?? 0;
}

/** Recompute subtotal + total from line items (optimistic; server reconciles). */
function recomputeTotals(cart: Cart): Cart {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + (item.lineTotal ?? item.unitPrice * item.quantity),
    0,
  );
  const totals = cart.totals ?? { subtotal: 0, total: 0 };
  const discount = totals.discount ?? 0;
  const shipping = totals.shipping ?? 0;
  const tax = totals.tax ?? 0;
  const total = Math.max(0, subtotal - discount + shipping + tax);
  return {
    ...cart,
    itemCount: cart.items.reduce((n, i) => n + (i.quantity ?? 0), 0),
    totals: { ...totals, subtotal, discount, shipping, tax, total },
  };
}

/** Optimistically set a line's quantity. */
export function applyItemQuantity(cart: Cart, itemId: string, quantity: number): Cart {
  const items = cart.items.map((item) =>
    item.id === itemId ? { ...item, quantity, lineTotal: item.unitPrice * quantity } : item,
  );
  return recomputeTotals({ ...cart, items });
}

/** Optimistically remove a line. */
export function removeItemFromCart(cart: Cart, itemId: string): Cart {
  const items = cart.items.filter((item) => item.id !== itemId);
  return recomputeTotals({ ...cart, items });
}
