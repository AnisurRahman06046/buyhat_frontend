import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCategoriesServer, getProductsServer } from "@/features/catalog/api/catalog-server";
import { ProductListing } from "@/features/catalog/components/product-listing";
import { filtersToParams, parseFilters } from "@/features/catalog/lib/filters";
import type { Category, ProductSummary } from "@/types/catalog";

function flatten(categories: Category[]): Category[] {
  const out: Category[] = [];
  const walk = (list: Category[]) => {
    for (const c of list) {
      out.push(c);
      if (c.children?.length) walk(c.children);
    }
  };
  walk(categories);
  return out;
}

async function findCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategoriesServer().catch(() => []);
  return flatten(categories).find((c) => c.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await findCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: category.description ?? `Shop ${category.name} at BuyHat.`,
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const category = await findCategoryBySlug(slug);
  if (!category) notFound();

  const filters = parseFilters(sp);
  const params2 = filtersToParams(filters, { categoryId: category.id });
  const firstPage = await getProductsServer(params2).catch(() => ({
    items: [] as ProductSummary[],
    total: 0,
    page: 1,
    limit: 12,
  }));

  return (
    <div className="container-page py-8">
      <h1 className="text-headline-lg text-foreground">{category.name}</h1>
      {category.description ? (
        <p className="text-body-md text-muted-foreground mt-1 max-w-2xl">{category.description}</p>
      ) : null}
      <div className="mt-6">
        <ProductListing
          initialFilters={filters}
          initialData={{ pages: [firstPage], pageParams: [1] }}
          categoryId={category.id}
        />
      </div>
    </div>
  );
}
