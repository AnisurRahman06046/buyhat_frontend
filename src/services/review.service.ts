import type { Paginated, PaginationParams } from "@/types/common";
import type { CreateReviewPayload, Review, UpdateReviewPayload } from "@/types/review";

import { httpDelete, httpGet, httpPatch, httpPost } from "./http";

export const reviewService = {
  getProductReviews: (productId: string, params?: PaginationParams, signal?: AbortSignal) =>
    httpGet<Paginated<Review>>(`/products/${productId}/reviews`, { params, signal }),

  createReview: (productId: string, payload: CreateReviewPayload) =>
    httpPost<Review>(`/products/${productId}/reviews`, payload),

  updateReview: (reviewId: string, payload: UpdateReviewPayload) =>
    httpPatch<Review>(`/reviews/${reviewId}`, payload),

  deleteReview: (reviewId: string) => httpDelete<void>(`/reviews/${reviewId}`),

  markHelpful: (reviewId: string) => httpPost<Review>(`/reviews/${reviewId}/helpful`),

  // ── Moderation (staff) ───────────────────────────────────────────────────
  listForModeration: (params?: PaginationParams & { status?: string }, signal?: AbortSignal) =>
    httpGet<Paginated<Review>>("/reviews", { params, signal }),

  approveReview: (reviewId: string) => httpPatch<Review>(`/reviews/${reviewId}/approve`),

  rejectReview: (reviewId: string) => httpPatch<Review>(`/reviews/${reviewId}/reject`),
};
