import type { Metadata } from "next";

import { RequireAuth } from "@/features/auth/components/guards";
import { CheckoutView } from "@/features/checkout/components/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <div className="container-page py-8">
        <h1 className="text-display-lg text-primary mb-1">Checkout</h1>
        <p className="text-body-md text-muted-foreground mb-6">
          Complete your purchase in a few simple steps.
        </p>
        <CheckoutView />
      </div>
    </RequireAuth>
  );
}
