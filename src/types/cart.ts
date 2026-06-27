export interface CartItem {
  id: string;
  variantId: string;
  productId?: string;
  productName: string;
  productSlug?: string;
  variantLabel?: string | null;
  sku?: string | null;
  imageUrl?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  available?: number;
  /** Set when the snapshot price/availability changed since it was added. */
  priceChanged?: boolean;
  outOfStock?: boolean;
}

export interface CartTotals {
  subtotal: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  total: number;
}

export interface AppliedCoupon {
  code: string;
  discount: number;
  type?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totals: CartTotals;
  coupon?: AppliedCoupon | null;
  itemCount: number;
  currency?: string;
}

export interface AddCartItemPayload {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface ApplyCouponPayload {
  code: string;
}

export interface MergeCartPayload {
  guestId: string;
}
