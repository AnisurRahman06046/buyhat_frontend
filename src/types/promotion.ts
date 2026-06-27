export type CouponType = "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minPurchaseAmount?: number | null;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  usageLimitPerIp?: number | null;
  usedCount?: number;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
  promotionId?: string | null;
  categoryIds?: string[];
}

export interface CreateCouponPayload {
  code: string;
  type: CouponType;
  value: number;
  minPurchaseAmount?: number | null;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  usageLimitPerIp?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
  promotionId?: string | null;
  categoryIds?: string[];
}
export type UpdateCouponPayload = Partial<CreateCouponPayload>;

export interface FlashSaleItem {
  variantId: string;
  productId: string;
  salePrice: number;
  quantityLimit?: number | null;
  productName?: string;
  productSlug?: string;
  imageUrl?: string | null;
  originalPrice?: number;
}

export interface FlashSale {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  isActive?: boolean;
  items: FlashSaleItem[];
}

export interface CreateFlashSalePayload {
  name: string;
  startsAt: string;
  endsAt: string;
  items: FlashSaleItem[];
}
export type UpdateFlashSalePayload = Partial<CreateFlashSalePayload>;

export interface Promotion {
  id: string;
  name: string;
  description?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
}

export interface CreatePromotionPayload {
  name: string;
  description?: string;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
}
export type UpdatePromotionPayload = Partial<CreatePromotionPayload>;
