"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { promotionService } from "@/services/promotion.service";

export function useActiveFlashSales() {
  return useQuery({
    queryKey: queryKeys.promotions.flashSalesActive,
    queryFn: ({ signal }) => promotionService.getActiveFlashSales(signal),
    staleTime: 60 * 1000,
  });
}
