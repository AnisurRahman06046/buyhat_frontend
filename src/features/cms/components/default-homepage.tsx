import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { getCategoriesServer, getProductsServer } from "@/features/catalog/api/catalog-server";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import type { ProductSummary } from "@/types/catalog";

/** Fallback homepage when the CMS has no active sections (or is unavailable). */
export async function DefaultHomepage() {
  const [featured, categories] = await Promise.all([
    getProductsServer({ limit: 8 }).catch(() => ({
      items: [] as ProductSummary[],
      total: 0,
      page: 1,
      limit: 8,
    })),
    getCategoriesServer().catch(() => []),
  ]);

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="container-page py-16 lg:py-24">
          <div className="max-w-xl space-y-5">
            <span className="text-label-caps text-primary-foreground/70">New Season Arrivals</span>
            <h1 className="text-display-lg">
              Premium products, <span className="text-cta">effortless</span> shopping.
            </h1>
            <p className="text-body-lg text-primary-foreground/80">
              Discover curated electronics, fashion, and home essentials — fast delivery, secure
              checkout, easy returns.
            </p>
            <Button variant="cta" size="lg" asChild>
              <Link href={routes.shop}>
                Shop Now <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {categories.length > 0 ? (
        <section className="container-page py-12">
          <SectionHeader title="Shop by Category" className="mb-6" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={routes.category(category.slug)}
                className="rounded-card border-border bg-card text-foreground shadow-card hover:shadow-card-hover border p-4 text-center text-sm font-semibold transition-shadow"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container-page py-12">
        <SectionHeader
          title="Featured Products"
          action={
            <Button variant="link" asChild>
              <Link href={routes.shop}>
                View all <ArrowRight />
              </Link>
            </Button>
          }
          className="mb-6"
        />
        <ProductGrid products={featured.items ?? []} />
      </section>
    </>
  );
}
