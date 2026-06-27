export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  description?: string | null;
  position?: number;
  isActive?: boolean;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  isActive?: boolean;
}

export type AttributeType = "SELECT" | "TEXT" | "NUMBER" | "BOOLEAN";

export interface AttributeOption {
  id: string;
  value: string;
  label: string;
  position?: number;
}

export interface Attribute {
  id: string;
  name: string;
  code: string;
  type: AttributeType;
  isVariantDefining?: boolean;
  isFilterable?: boolean;
  options?: AttributeOption[];
}

export interface ProductMedia {
  id: string;
  url: string;
  alt?: string | null;
  isPrimary?: boolean;
  position?: number;
  variantId?: string | null;
}

export interface Variant {
  id: string;
  sku?: string | null;
  barcode?: string | null;
  price: number;
  compareAtPrice?: number | null;
  weight?: number | null;
  isActive?: boolean;
  attributeValues?: { attributeId: string; optionId?: string; value?: string }[];
  available?: number;
}

export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

/** Card/list projection. */
export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  compareAtPrice?: number | null;
  currency?: string;
  brandName?: string | null;
  categoryName?: string | null;
  primaryImageUrl?: string | null;
  rating?: number;
  reviewCount?: number;
  status?: ProductStatus;
  badges?: string[];
  available?: number;
  /** Present for single-/default-variant products — enables quick add-to-cart. */
  defaultVariantId?: string | null;
}

/** Full PDP projection. */
export interface ProductDetail extends ProductSummary {
  description?: string | null;
  brandId?: string | null;
  categoryId?: string | null;
  media?: ProductMedia[];
  variants?: Variant[];
  attributes?: Attribute[];
  specifications?: { label: string; value: string }[];
}

// ── Payloads ───────────────────────────────────────────────────────────────
export interface CreateCategoryPayload {
  name: string;
  slug: string;
  parentId?: string | null;
  description?: string;
  position?: number;
  isActive?: boolean;
}
export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export interface AssignAttributePayload {
  attributeId: string;
  isRequired?: boolean;
  position?: number;
}

export interface CreateBrandPayload {
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string;
  isActive?: boolean;
}
export type UpdateBrandPayload = Partial<CreateBrandPayload>;

export interface CreateAttributePayload {
  name: string;
  code: string;
  type: AttributeType;
  isVariantDefining?: boolean;
  isFilterable?: boolean;
  options?: { value: string; label: string; position?: number }[];
}
export type UpdateAttributePayload = Partial<Omit<CreateAttributePayload, "options">>;

export interface AddAttributeOptionPayload {
  value: string;
  label: string;
  position?: number;
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  categoryId: string;
  brandId?: string;
  description?: string;
  basePrice: number;
  currency?: string;
}
export type UpdateProductPayload = Partial<Omit<CreateProductPayload, "slug">>;

export interface SetAttributeValuesPayload {
  values: { attributeId: string; optionId?: string; valueText?: string }[];
}

export interface GenerateVariantsPayload {
  options: Record<string, string[]>;
  defaults?: { price?: number; weight?: number };
  overrides?: { sku?: string; price?: number }[];
}

export interface UpdateVariantPayload {
  price?: number;
  sku?: string;
  barcode?: string;
  compareAtPrice?: number;
  weight?: number;
  isActive?: boolean;
}

export interface PresignMediaPayload {
  fileName: string;
  contentType: string;
  variantId?: string | null;
}
export interface RecordMediaPayload {
  key: string;
  contentType: string;
  variantId?: string | null;
  alt?: string;
  isPrimary?: boolean;
}
export interface UpdateMediaPayload {
  alt?: string;
  isPrimary?: boolean;
  position?: number;
}

/** Faceted search params (`GET /products/search`). */
export interface ProductSearchParams {
  q?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  limit?: number;
  cursor?: string;
  [key: string]: string | number | undefined;
}
