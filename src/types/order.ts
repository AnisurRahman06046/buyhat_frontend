import type { Address } from "./user";

export interface OrderItem {
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
}

export interface OrderHistoryEntry {
  status: string;
  note?: string | null;
  createdAt: string;
}

export interface OrderReturnItem {
  orderItemId: string;
  quantity: number;
}

export interface OrderReturn {
  id: string;
  orderId: string;
  status: string;
  reason?: string | null;
  items: OrderReturnItem[];
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus?: string;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  total: number;
  currency?: string;
  shippingAddress?: Address | null;
  billingAddress?: Address | null;
  customerNote?: string | null;
  history?: OrderHistoryEntry[];
  createdAt: string;
  updatedAt?: string;
}

/** Order list/board projection. */
export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus?: string;
  total: number;
  itemCount?: number;
  customerName?: string;
  createdAt: string;
}

export interface CreateOrderPayload {
  shippingAddressId: string;
  billingAddressId?: string | null;
  customerNote?: string;
}

export interface CancelOrderPayload {
  reason?: string;
}

export interface UpdateOrderStatusPayload {
  status: string;
  note?: string;
}

export interface RequestReturnPayload {
  items: OrderReturnItem[];
  reason?: string;
}

export interface UpdateReturnPayload {
  status: string;
  note?: string;
}
