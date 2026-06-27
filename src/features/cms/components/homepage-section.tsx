import type { HomepageSection as Section } from "@/types/cms";

import { BannerSection } from "./sections/banner-section";
import { BrandsSection } from "./sections/brands-section";
import { CategoryGrid } from "./sections/category-grid";
import { FlashSaleSection } from "./sections/flash-sale-section";
import { HeroSlider } from "./sections/hero-slider";
import { NewsletterSection } from "./sections/newsletter-section";
import { ProductsSection } from "./sections/products-section";

/**
 * Section registry: maps a CMS section type to its renderer. Unknown types
 * render nothing (graceful degradation) — adding a new section = one component
 * + one case here.
 */
export function HomepageSection({ section }: { section: Section }) {
  switch (section.type) {
    case "HERO_SLIDER":
      return <HeroSlider section={section} />;
    case "FLASH_SALE":
      return <FlashSaleSection section={section} />;
    case "CATEGORY_GRID":
      return <CategoryGrid section={section} />;
    case "FEATURED_PRODUCTS":
    case "BEST_SELLERS":
    case "NEW_ARRIVALS":
      return <ProductsSection section={section} />;
    case "BRANDS":
      return <BrandsSection section={section} />;
    case "BANNER":
      return <BannerSection section={section} />;
    case "NEWSLETTER":
      return <NewsletterSection section={section} />;
    default:
      return null;
  }
}
