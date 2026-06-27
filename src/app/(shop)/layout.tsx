import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { ShopFooter } from "@/components/layout/shop-footer";
import { ShopHeaderContainer } from "@/components/layout/shop-header-container";
import { PromotionPopup } from "@/features/cms/components/promotion-popup";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AnnouncementBar
        id="free-shipping"
        message="Free shipping on orders over ৳1,500 — for a limited time!"
        ctaLabel="Shop now"
        ctaHref="/products"
      />
      <ShopHeaderContainer />
      <main className="flex-1">{children}</main>
      <ShopFooter />
      <PromotionPopup />
    </div>
  );
}
