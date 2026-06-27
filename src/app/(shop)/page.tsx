import { RecentlyViewedStrip } from "@/features/catalog/components/recently-viewed-strip";
import { Homepage } from "@/features/cms/components/homepage";

export const revalidate = 120;

/** CMS-driven storefront homepage (section registry) + recently-viewed strip. */
export default function HomePage() {
  return (
    <>
      <Homepage />
      <RecentlyViewedStrip />
    </>
  );
}
