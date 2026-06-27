import type { Metadata } from "next";

import { WishlistView } from "@/features/wishlist/components/wishlist-view";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved BuyHat products.",
};

export default function WishlistPage() {
  return (
    <div className="container-page py-8">
      <h1 className="text-headline-lg text-foreground mb-6">My Wishlist</h1>
      <WishlistView />
    </div>
  );
}
