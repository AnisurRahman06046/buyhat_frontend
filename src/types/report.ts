export interface SalesReportPoint {
  period: string;
  revenue: number;
  orders: number;
}
export interface SalesReport {
  granularity: "day" | "week" | "month" | "year";
  totalRevenue: number;
  totalOrders: number;
  points: SalesReportPoint[];
}

export interface ProductReportRow {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
}
export interface ProductReport {
  order: "best" | "worst";
  rows: ProductReportRow[];
}

export interface CustomerReport {
  newCustomers: number;
  repeatCustomers: number;
  totalCustomers?: number;
}

export interface InventoryReportRow {
  variantId: string;
  productName?: string;
  sku?: string | null;
  available: number;
  status?: "LOW" | "OUT" | "OK";
}
export interface InventoryReport {
  rows: InventoryReportRow[];
}

export interface SalesReportParams {
  granularity?: "day" | "week" | "month" | "year";
  from?: string;
  to?: string;
}
export interface ProductReportParams {
  order?: "best" | "worst";
  limit?: number;
}
export interface InventoryReportParams {
  limit?: number;
}

export interface AuditLog {
  id: string;
  actorId?: string | null;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
