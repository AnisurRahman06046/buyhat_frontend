"use client";

import Link from "next/link";
import { Package } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";

import { useOrders } from "../hooks/use-orders";
import { OrderCard } from "./order-card";

export function OrderHistoryList() {
  const query = useOrders();

  if (query.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (query.isError) {
    return <ErrorState onRetry={() => query.refetch()} />;
  }

  const orders = query.data?.pages.flatMap((page) => page.items ?? []) ?? [];

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="When you place an order, it will show up here."
        action={
          <Button variant="cta" asChild>
            <Link href={routes.shop}>Start Shopping</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
      {query.hasNextPage ? (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
          >
            {query.isFetchingNextPage ? "Loading…" : "Load More"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
