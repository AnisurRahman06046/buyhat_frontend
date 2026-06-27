"use client";

import { useWishlist } from "@/hooks/use-wishlist";

import { ShopHeader } from "./shop-header";

/**
 * Wires live wishlist/cart counts into the presentational `ShopHeader`.
 * (Cart count is connected in Phase 6.)
 */
export function ShopHeaderContainer() {
  const wishlist = useWishlist();
  return <ShopHeader wishlistCount={wishlist.count} cartCount={0} />;
}
