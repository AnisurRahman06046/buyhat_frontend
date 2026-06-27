/**
 * Centralized TanStack Query key factory. Hierarchical, tuple-based keys make
 * invalidation precise and refactor-safe:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
 * invalidates every product query; `.detail(slug)` targets exactly one.
 *
 * `as const` preserves literal tuple types for full inference.
 */
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  user: {
    profile: ["user", "profile"] as const,
    addresses: ["user", "addresses"] as const,
  },
  products: {
    all: ["products"] as const,
    list: (params?: Record<string, unknown>) => ["products", "list", params ?? {}] as const,
    detail: (slug: string) => ["products", "detail", slug] as const,
    variants: (productId: string) => ["products", productId, "variants"] as const,
    related: (productId: string) => ["products", productId, "related"] as const,
    search: (params?: Record<string, unknown>) => ["products", "search", params ?? {}] as const,
  },
  categories: {
    all: ["categories"] as const,
    detail: (id: string) => ["categories", id] as const,
    attributes: (id: string) => ["categories", id, "attributes"] as const,
  },
  brands: {
    all: ["brands"] as const,
    detail: (id: string) => ["brands", id] as const,
  },
  attributes: {
    all: ["attributes"] as const,
    detail: (id: string) => ["attributes", id] as const,
    options: (id: string) => ["attributes", id, "options"] as const,
  },
  cart: {
    current: ["cart"] as const,
  },
  inventory: {
    byVariant: (variantId: string) => ["inventory", variantId] as const,
    movements: (variantId: string, params?: Record<string, unknown>) =>
      ["inventory", variantId, "movements", params ?? {}] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (params?: Record<string, unknown>) => ["orders", "list", params ?? {}] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
    returns: (id: string) => ["orders", id, "returns"] as const,
  },
  payments: {
    byOrder: (orderId: string) => ["payments", "order", orderId] as const,
  },
  reviews: {
    byProduct: (productId: string, params?: Record<string, unknown>) =>
      ["reviews", "product", productId, params ?? {}] as const,
    moderation: (params?: Record<string, unknown>) =>
      ["reviews", "moderation", params ?? {}] as const,
  },
  promotions: {
    coupons: (params?: Record<string, unknown>) => ["promotions", "coupons", params ?? {}] as const,
    flashSalesActive: ["promotions", "flash-sales", "active"] as const,
    campaigns: (params?: Record<string, unknown>) =>
      ["promotions", "campaigns", params ?? {}] as const,
  },
  cms: {
    homepage: ["cms", "homepage"] as const,
    banners: ["cms", "banners"] as const,
    popups: ["cms", "popups"] as const,
    landingPage: (slug: string) => ["cms", "landing-pages", slug] as const,
  },
  notifications: {
    list: (params?: Record<string, unknown>) => ["notifications", params ?? {}] as const,
    preferences: ["notifications", "preferences"] as const,
  },
  reports: {
    sales: (params?: Record<string, unknown>) => ["reports", "sales", params ?? {}] as const,
    products: (params?: Record<string, unknown>) => ["reports", "products", params ?? {}] as const,
    customers: (params?: Record<string, unknown>) =>
      ["reports", "customers", params ?? {}] as const,
    inventory: (params?: Record<string, unknown>) =>
      ["reports", "inventory", params ?? {}] as const,
  },
  audit: {
    list: (params?: Record<string, unknown>) => ["audit", params ?? {}] as const,
  },
} as const;
