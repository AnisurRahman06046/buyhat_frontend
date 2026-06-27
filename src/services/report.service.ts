import type { Paginated, PaginationParams } from "@/types/common";
import type {
  AuditLog,
  CustomerReport,
  InventoryReport,
  InventoryReportParams,
  ProductReport,
  ProductReportParams,
  SalesReport,
  SalesReportParams,
} from "@/types/report";

import { httpGet } from "./http";

export const reportService = {
  sales: (params?: SalesReportParams, signal?: AbortSignal) =>
    httpGet<SalesReport>("/reports/sales", { params, signal }),

  products: (params?: ProductReportParams, signal?: AbortSignal) =>
    httpGet<ProductReport>("/reports/products", { params, signal }),

  customers: (signal?: AbortSignal) => httpGet<CustomerReport>("/reports/customers", { signal }),

  inventory: (params?: InventoryReportParams, signal?: AbortSignal) =>
    httpGet<InventoryReport>("/reports/inventory", { params, signal }),
};

export const auditService = {
  list: (params?: PaginationParams, signal?: AbortSignal) =>
    httpGet<Paginated<AuditLog>>("/audit", { params, signal }),
};
