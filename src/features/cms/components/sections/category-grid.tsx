import Link from "next/link";

import { SectionHeader } from "@/components/shared/section-header";
import { routes } from "@/config/routes";
import { getCategoriesServer } from "@/features/catalog/api/catalog-server";
import type { HomepageSection } from "@/types/cms";

export async function CategoryGrid({ section }: { section: HomepageSection }) {
  const categories = await getCategoriesServer().catch(() => []);
  if (categories.length === 0) return null;

  return (
    <section className="container-page py-10">
      <SectionHeader title={section.title ?? "Shop by Category"} className="mb-6" />
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
  );
}
