import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";

export function EmptyCart({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="Your cart is empty"
      description="Looks like you haven't added anything yet. Let's fix that."
      action={
        <Button variant="cta" asChild onClick={onAction}>
          <Link href={routes.shop}>Start Shopping</Link>
        </Button>
      }
    />
  );
}
