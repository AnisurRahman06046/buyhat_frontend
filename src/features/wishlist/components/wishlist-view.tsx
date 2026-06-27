"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { useMounted } from "@/hooks/use-mounted";
import { useWishlist } from "@/hooks/use-wishlist";

export function WishlistView() {
  const mounted = useMounted();
  const wishlist = useWishlist();

  // Avoid an empty-state flash before the persisted store hydrates.
  if (!mounted) {
    return <ProductGrid products={[]} isLoading skeletonCount={8} />;
  }

  if (wishlist.items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Save items you love and find them here later."
        action={
          <Button variant="cta" asChild>
            <Link href={routes.shop}>Browse Products</Link>
          </Button>
        }
      />
    );
  }

  return <ProductGrid products={wishlist.items} />;
}
