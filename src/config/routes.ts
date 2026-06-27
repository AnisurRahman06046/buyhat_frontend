/**
 * Single source of truth for application paths. Never hardcode a route string in
 * a component — reference `routes.*` so renames stay safe and centralized.
 * Dynamic segments are functions; static paths are strings.
 */
export const routes = {
  // ── Customer storefront ───────────────────────────────────────────────
  home: "/",
  shop: "/products",
  product: (slug: string) => `/products/${slug}`,
  category: (slug: string) => `/categories/${slug}`,
  search: (query?: string) => (query ? `/search?q=${encodeURIComponent(query)}` : "/search"),
  cart: "/cart",
  wishlist: "/wishlist",
  checkout: "/checkout",
  orderSuccess: (orderId: string) => `/checkout/success/${orderId}`,
  orderTracking: (orderId: string) => `/orders/${orderId}`,
  promotions: "/promotions",

  // ── Account ───────────────────────────────────────────────────────────
  account: {
    root: "/account",
    profile: "/account/profile",
    orders: "/account/orders",
    order: (orderId: string) => `/account/orders/${orderId}`,
    addresses: "/account/addresses",
    reviews: "/account/reviews",
    wishlist: "/account/wishlist",
    notifications: "/account/notifications",
  },

  // ── Auth ──────────────────────────────────────────────────────────────
  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
  },

  // ── Admin panel ───────────────────────────────────────────────────────
  admin: {
    root: "/admin",
    dashboard: "/admin",
    products: "/admin/products",
    product: (id: string) => `/admin/products/${id}`,
    productNew: "/admin/products/new",
    categories: "/admin/categories",
    attributes: "/admin/attributes",
    inventory: "/admin/inventory",
    orders: "/admin/orders",
    order: (id: string) => `/admin/orders/${id}`,
    payments: "/admin/payments",
    customers: "/admin/customers",
    customer: (id: string) => `/admin/customers/${id}`,
    coupons: "/admin/coupons",
    flashSales: "/admin/flash-sales",
    promotions: "/admin/promotions",
    cms: "/admin/cms",
    banners: "/admin/cms/banners",
    popups: "/admin/cms/popups",
    reviews: "/admin/reviews",
    reports: "/admin/reports",
    settings: "/admin/settings",
    roles: "/admin/settings/roles",
    audit: "/admin/audit",
  },
} as const;

export type Routes = typeof routes;
