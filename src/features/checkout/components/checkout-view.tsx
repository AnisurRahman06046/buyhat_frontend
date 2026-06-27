"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Spinner } from "@/components/shared/spinner";
import { routes } from "@/config/routes";
import { EmptyCart } from "@/features/cart/components/empty-cart";
import { useCart } from "@/features/cart/hooks/use-cart";
import { useAddresses } from "@/features/profile/hooks/use-addresses";
import { isApiError } from "@/services/http-error";

import { usePlaceOrder } from "../hooks/use-checkout";
import type { PaymentMethodId } from "../lib/payment-methods";
import { CheckoutSection } from "./checkout-section";
import { CheckoutSummary } from "./checkout-summary";
import { deliveryFee, DeliverySection, type DeliveryOptionId } from "./delivery-section";
import { PaymentSection } from "./payment-section";
import { ShippingSection } from "./shipping-section";

export function CheckoutView() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const { data: addresses } = useAddresses();
  const place = usePlaceOrder();

  const [addressId, setAddressId] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<DeliveryOptionId>("standard");
  const [method, setMethod] = useState<PaymentMethodId>("cod");

  // Pre-select the default (or first) saved address once loaded.
  useEffect(() => {
    if (!addressId && addresses && addresses.length > 0) {
      const preferred = addresses.find((a) => a.isDefaultShipping) ?? addresses[0];
      if (preferred) setAddressId(preferred.id);
    }
  }, [addresses, addressId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  const fee = deliveryFee(delivery);
  const placeError = place.isError && isApiError(place.error) ? place.error.message : null;

  const confirm = () => {
    if (!addressId) {
      toast.error("Please select a shipping address");
      return;
    }
    place.mutate(
      { shippingAddressId: addressId, method },
      {
        onSuccess: ({ order, payment }) => {
          if (payment?.redirectUrl) {
            window.location.href = payment.redirectUrl;
            return;
          }
          router.push(routes.orderSuccess(order.id));
        },
      },
    );
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        <CheckoutSection step={1} title="Shipping Information">
          <ShippingSection selectedAddressId={addressId} onSelect={setAddressId} />
        </CheckoutSection>
        <CheckoutSection step={2} title="Delivery Options">
          <DeliverySection value={delivery} onChange={setDelivery} />
        </CheckoutSection>
        <CheckoutSection step={3} title="Payment Method">
          <PaymentSection value={method} onChange={setMethod} />
        </CheckoutSection>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        {placeError ? (
          <div
            role="alert"
            className="border-destructive/20 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
          >
            {placeError}
          </div>
        ) : null}
        <CheckoutSummary
          cart={cart}
          deliveryFee={fee}
          onConfirm={confirm}
          isPlacing={place.isPending}
          canConfirm={Boolean(addressId)}
        />
      </div>
    </div>
  );
}
