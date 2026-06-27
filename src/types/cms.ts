import type { ProductSummary } from "./catalog";

export type HomepageSectionType =
  | "HERO_SLIDER"
  | "FLASH_SALE"
  | "CATEGORY_GRID"
  | "FEATURED_PRODUCTS"
  | "BEST_SELLERS"
  | "NEW_ARRIVALS"
  | "BRANDS"
  | "BANNER"
  | "NEWSLETTER";

/** Section config is a free-form bag (varies per type). */
export interface HomepageSection {
  id: string;
  type: HomepageSectionType | string;
  title?: string | null;
  position: number;
  isActive: boolean;
  config?: Record<string, unknown>;
  /** Server may hydrate resolved products for product-bearing sections. */
  products?: ProductSummary[];
}

export interface Homepage {
  sections: HomepageSection[];
}

export interface CreateSectionPayload {
  type: string;
  title?: string;
  position?: number;
  isActive?: boolean;
  config?: Record<string, unknown>;
}
export type UpdateSectionPayload = Partial<CreateSectionPayload>;

export interface ReorderSectionsPayload {
  sectionIds: string[];
}

export type BannerPlacement = "HOME_HERO" | "HOME_PROMO" | "CATEGORY_TOP" | string;

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  mobileImageUrl?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  placement: BannerPlacement;
  position?: number;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
}

export interface CreateBannerPayload {
  title: string;
  imageUrl: string;
  mobileImageUrl?: string | null;
  ctaText?: string;
  ctaUrl?: string;
  placement: BannerPlacement;
  position?: number;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
}
export type UpdateBannerPayload = Partial<CreateBannerPayload>;

export type PopupTrigger = "AFTER_DELAY" | "EXIT_INTENT" | "ON_LOAD" | string;
export type PopupFrequency = "ONCE" | "EVERY_SESSION" | "ALWAYS" | string;
export type PopupAudience = "GUESTS" | "USERS" | "EVERYONE" | string;

export interface Popup {
  id: string;
  title: string;
  content?: string | null;
  imageUrl?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  trigger: PopupTrigger;
  delaySeconds?: number | null;
  frequency: PopupFrequency;
  audience: PopupAudience;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
}

export interface CreatePopupPayload {
  title: string;
  content?: string;
  imageUrl?: string | null;
  ctaText?: string;
  ctaUrl?: string;
  trigger: PopupTrigger;
  delaySeconds?: number;
  frequency: PopupFrequency;
  audience: PopupAudience;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
}
export type UpdatePopupPayload = Partial<CreatePopupPayload>;

export interface LandingPage {
  id: string;
  slug: string;
  title: string;
  content?: Record<string, unknown> | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isPublished?: boolean;
}

export interface CreateLandingPagePayload {
  slug: string;
  title: string;
  content?: Record<string, unknown>;
  seoTitle?: string;
  seoDescription?: string;
  isPublished?: boolean;
}
export type UpdateLandingPagePayload = Partial<CreateLandingPagePayload>;
