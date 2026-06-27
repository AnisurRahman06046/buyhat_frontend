import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";
import { getProductBySlugServer, getProductsServer } from "@/features/catalog/api/catalog-server";
import { ProductBreadcrumbs } from "@/features/catalog/components/product-breadcrumbs";
import { ProductDetailView } from "@/features/catalog/components/product-detail-view";
import { ProductJsonLd } from "@/features/catalog/components/product-json-ld";
import { RelatedProducts } from "@/features/catalog/components/related-products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugServer(slug).catch(() => null);
  if (!product) return { title: "Product not found" };

  const description = (product.description ?? `Buy ${product.name} at ${siteConfig.name}.`).slice(
    0,
    160,
  );

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: product.primaryImageUrl ? [product.primaryImageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlugServer(slug).catch(() => null);
  if (!product) notFound();

  const related = product.categoryId
    ? await getProductsServer({ categoryId: product.categoryId, limit: 5 })
        .then((r) => (r.items ?? []).filter((p) => p.id !== product.id).slice(0, 4))
        .catch(() => [])
    : [];

  return (
    <div className="container-page py-6">
      <ProductBreadcrumbs product={product} />
      <ProductJsonLd product={product} />
      <ProductDetailView product={product} />
      <RelatedProducts products={related} />
    </div>
  );
}
