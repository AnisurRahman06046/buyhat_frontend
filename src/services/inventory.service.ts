import type { Paginated, PaginationParams } from "@/types/common";
import type {
  AdjustmentPayload,
  Reservation,
  ReservationRefPayload,
  ReservePayload,
  StockChangePayload,
  StockItem,
  StockMovement,
} from "@/types/inventory";

import { httpGet, httpPost } from "./http";

export const inventoryService = {
  getStockLevels: (variantIds: string[], signal?: AbortSignal) =>
    httpGet<StockItem[]>("/inventory", { params: { variantIds: variantIds.join(",") }, signal }),

  getStock: (variantId: string, signal?: AbortSignal) =>
    httpGet<StockItem>(`/inventory/${variantId}`, { signal }),

  getMovements: (variantId: string, params?: PaginationParams, signal?: AbortSignal) =>
    httpGet<Paginated<StockMovement>>(`/inventory/${variantId}/movements`, { params, signal }),

  stockIn: (payload: StockChangePayload) => httpPost<StockItem>("/inventory/stock-in", payload),
  stockOut: (payload: StockChangePayload) => httpPost<StockItem>("/inventory/stock-out", payload),
  adjust: (payload: AdjustmentPayload) => httpPost<StockItem>("/inventory/adjustment", payload),
  returnToStock: (payload: StockChangePayload) => httpPost<StockItem>("/inventory/return", payload),
  markDamaged: (payload: StockChangePayload) => httpPost<StockItem>("/inventory/damage", payload),

  reserve: (payload: ReservePayload) => httpPost<Reservation>("/inventory/reserve", payload),
  release: (payload: ReservationRefPayload) => httpPost<void>("/inventory/release", payload),
  confirm: (payload: ReservationRefPayload) => httpPost<void>("/inventory/confirm", payload),
};
