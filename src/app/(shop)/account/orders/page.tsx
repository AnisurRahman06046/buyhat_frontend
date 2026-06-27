import type { Metadata } from "next";

import { OrderHistoryList } from "@/features/orders/components/order-history-list";

export const metadata: Metadata = {
  title: "My Orders",
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-headline-lg text-foreground mb-6">My Orders</h1>
      <OrderHistoryList />
    </div>
  );
}
