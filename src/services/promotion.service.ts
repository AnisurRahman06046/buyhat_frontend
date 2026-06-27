import type { Paginated, PaginationParams } from "@/types/common";
import type {
  Coupon,
  CreateCouponPayload,
  CreateFlashSalePayload,
  CreatePromotionPayload,
  FlashSale,
  Promotion,
  UpdateCouponPayload,
  UpdateFlashSalePayload,
  UpdatePromotionPayload,
} from "@/types/promotion";

import { httpDelete, httpGet, httpPatch, httpPost } from "./http";

export const promotionService = {
  // ── Coupons ────────────────────────────────────────────────────────────
  listCoupons: (params?: PaginationParams, signal?: AbortSignal) =>
    httpGet<Paginated<Coupon>>("/coupons", { params, signal }),
  getCoupon: (id: string, signal?: AbortSignal) => httpGet<Coupon>(`/coupons/${id}`, { signal }),
  createCoupon: (payload: CreateCouponPayload) => httpPost<Coupon>("/coupons", payload),
  updateCoupon: (id: string, payload: UpdateCouponPayload) =>
    httpPatch<Coupon>(`/coupons/${id}`, payload),
  deleteCoupon: (id: string) => httpDelete<void>(`/coupons/${id}`),

  // ── Flash sales ──────────────────────────────────────────────────────────
  getActiveFlashSales: (signal?: AbortSignal) =>
    httpGet<FlashSale[]>("/flash-sales/active", { signal }),
  listFlashSales: (params?: PaginationParams, signal?: AbortSignal) =>
    httpGet<Paginated<FlashSale>>("/flash-sales", { params, signal }),
  getFlashSale: (id: string, signal?: AbortSignal) =>
    httpGet<FlashSale>(`/flash-sales/${id}`, { signal }),
  createFlashSale: (payload: CreateFlashSalePayload) =>
    httpPost<FlashSale>("/flash-sales", payload),
  updateFlashSale: (id: string, payload: UpdateFlashSalePayload) =>
    httpPatch<FlashSale>(`/flash-sales/${id}`, payload),
  deleteFlashSale: (id: string) => httpDelete<void>(`/flash-sales/${id}`),

  // ── Promotions (campaigns) ───────────────────────────────────────────────
  listPromotions: (params?: PaginationParams, signal?: AbortSignal) =>
    httpGet<Paginated<Promotion>>("/promotions", { params, signal }),
  getPromotion: (id: string, signal?: AbortSignal) =>
    httpGet<Promotion>(`/promotions/${id}`, { signal }),
  createPromotion: (payload: CreatePromotionPayload) => httpPost<Promotion>("/promotions", payload),
  updatePromotion: (id: string, payload: UpdatePromotionPayload) =>
    httpPatch<Promotion>(`/promotions/${id}`, payload),
  deletePromotion: (id: string) => httpDelete<void>(`/promotions/${id}`),
};
