import type { Metadata } from "next";

import { CartView } from "@/features/cart/components/cart-view";

export const metadata: Metadata = {
  title: "Shopping Cart",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="container-page py-8">
      <h1 className="text-headline-lg text-foreground mb-6">Shopping Cart</h1>
      <CartView />
    </div>
  );
}
