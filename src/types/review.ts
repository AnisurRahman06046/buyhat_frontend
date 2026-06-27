export interface Review {
  id: string;
  productId: string;
  variantId?: string | null;
  userId?: string;
  authorName?: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  helpfulCount?: number;
  verifiedPurchase?: boolean;
  createdAt: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
  distribution?: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface CreateReviewPayload {
  rating: number;
  variantId?: string | null;
  title?: string;
  body?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  title?: string;
  body?: string;
}
