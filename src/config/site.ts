import { clientEnv } from "./env";

/**
 * Central brand / SEO configuration. Consumed by metadata, headers, footers,
 * and structured data. Keep marketing copy and social handles here — not inline.
 */
export const siteConfig = {
  name: clientEnv.NEXT_PUBLIC_SITE_NAME,
  shortName: "BuyHat",
  url: clientEnv.NEXT_PUBLIC_APP_URL,
  description:
    "BuyHat — a premium online store. Shop electronics, fashion, home & living, beauty and more with fast delivery, secure payments, and easy returns.",
  tagline: "Premium products. Effortless shopping.",
  locale: "en_BD",
  currency: "BDT",
  currencySymbol: "৳",
  keywords: [
    "BuyHat",
    "online shopping",
    "ecommerce Bangladesh",
    "electronics",
    "fashion",
    "home & living",
  ],
  contact: {
    email: "support@buyhat.example",
    phone: "+880 1XXX XXXXXX",
  },
  social: {
    facebook: "https://facebook.com/buyhat",
    instagram: "https://instagram.com/buyhat",
    twitter: "@buyhat",
  },
  ogImage: "/og-image.png",
} as const;

export type SiteConfig = typeof siteConfig;
