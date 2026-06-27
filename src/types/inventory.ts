export interface StockItem {
  variantId: string;
  available: number;
  reserved: number;
  onHand?: number;
  sold?: number;
  damaged?: number;
  returned?: number;
  lowStockThreshold?: number;
}

export type StockMovementType =
  | "STOCK_IN"
  | "STOCK_OUT"
  | "ADJUSTMENT"
  | "RESERVE"
  | "RELEASE"
  | "CONFIRM"
  | "RETURN"
  | "DAMAGE";

export interface StockMovement {
  id: string;
  variantId: string;
  type: StockMovementType;
  quantity: number;
  reason?: string | null;
  createdAt: string;
}

export interface Reservation {
  id: string;
  variantId: string;
  quantity: number;
  expiresAt?: string;
}

export interface StockChangePayload {
  variantId: string;
  quantity: number;
  reason?: string;
}

export interface AdjustmentPayload {
  variantId: string;
  quantityDelta: number;
  reason?: string;
}

export interface ReservePayload {
  variantId: string;
  quantity: number;
  ttlMinutes?: number;
  cartId?: string | null;
  orderId?: string | null;
}

export interface ReservationRefPayload {
  reservationId: string;
}
