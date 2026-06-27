"use client";

import { CartDrawer } from "@/features/cart/components/cart-drawer";
import { useCartCount } from "@/features/cart/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCartUiStore } from "@/store/cart-ui-store";

import { ShopHeader } from "./shop-header";

/**
 * Wires live wishlist/cart counts into the presentational `ShopHeader`, opens the
 * cart drawer from the header icon, and mounts the drawer app-wide.
 */
export function ShopHeaderContainer() {
  const wishlist = useWishlist();
  const cartCount = useCartCount();
  const openCart = useCartUiStore((s) => s.open);

  return (
    <>
      <ShopHeader wishlistCount={wishlist.count} cartCount={cartCount} onCartClick={openCart} />
      <CartDrawer />
    </>
  );
}
