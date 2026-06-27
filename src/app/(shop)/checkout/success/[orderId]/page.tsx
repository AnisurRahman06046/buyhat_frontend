import type { Metadata } from "next";

import { RequireAuth } from "@/features/auth/components/guards";
import { OrderSuccess } from "@/features/checkout/components/order-success";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <RequireAuth>
      <div className="container-page py-10">
        <OrderSuccess orderId={orderId} />
      </div>
    </RequireAuth>
  );
}
