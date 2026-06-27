import Link from "next/link";

import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { SectionHeader } from "@/components/shared/section-header";
import { routes } from "@/config/routes";
import { getBrandsServer } from "@/features/catalog/api/catalog-server";
import type { HomepageSection } from "@/types/cms";

export async function BrandsSection({ section }: { section: HomepageSection }) {
  const brands = await getBrandsServer().catch(() => []);
  if (brands.length === 0) return null;

  return (
    <section className="container-page py-10">
      <SectionHeader title={section.title ?? "Shop by Brand"} className="mb-6" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {brands.slice(0, 6).map((brand) => (
          <Link
            key={brand.id}
            href={`${routes.shop}?brands=${brand.id}`}
            className="rounded-card border-border bg-card shadow-card hover:shadow-card-hover flex h-20 items-center justify-center border p-3 transition-shadow"
          >
            {brand.logoUrl ? (
              <div className="relative h-10 w-full">
                <ImageWithFallback
                  src={brand.logoUrl}
                  alt={brand.name}
                  wrapperClassName="size-full bg-transparent"
                  sizes="160px"
                />
              </div>
            ) : (
              <span className="text-foreground text-sm font-semibold">{brand.name}</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
