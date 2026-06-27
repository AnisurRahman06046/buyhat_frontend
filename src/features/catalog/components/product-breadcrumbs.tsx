import { Breadcrumbs, type Crumb } from "@/components/shared/breadcrumbs";
import { routes } from "@/config/routes";
import type { ProductDetail } from "@/types/catalog";

export function ProductBreadcrumbs({ product }: { product: ProductDetail }) {
  const items: Crumb[] = [
    { label: "Home", href: routes.home },
    { label: "Shop", href: routes.shop },
  ];
  if (product.categoryName) {
    items.push({ label: product.categoryName, href: routes.shop });
  }
  items.push({ label: product.name });

  return <Breadcrumbs items={items} className="mb-5" />;
}
