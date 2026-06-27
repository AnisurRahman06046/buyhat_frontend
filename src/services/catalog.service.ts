import type {
  AddAttributeOptionPayload,
  AssignAttributePayload,
  Attribute,
  AttributeOption,
  Brand,
  Category,
  CreateAttributePayload,
  CreateBrandPayload,
  CreateCategoryPayload,
  CreateProductPayload,
  GenerateVariantsPayload,
  PresignMediaPayload,
  ProductDetail,
  ProductMedia,
  ProductSearchParams,
  ProductSummary,
  RecordMediaPayload,
  SetAttributeValuesPayload,
  UpdateAttributePayload,
  UpdateBrandPayload,
  UpdateCategoryPayload,
  UpdateMediaPayload,
  UpdateProductPayload,
  Variant,
} from "@/types/catalog";
import type { CursorPage, Paginated, PaginationParams } from "@/types/common";

import { httpDelete, httpGet, httpPost, httpPut } from "./http";

export const catalogService = {
  // ── Categories ─────────────────────────────────────────────────────────
  getCategories: (signal?: AbortSignal) => httpGet<Category[]>("/categories", { signal }),
  getCategory: (id: string, signal?: AbortSignal) =>
    httpGet<Category>(`/categories/${id}`, { signal }),
  getCategoryAttributes: (id: string, signal?: AbortSignal) =>
    httpGet<Attribute[]>(`/categories/${id}/attributes`, { signal }),
  createCategory: (payload: CreateCategoryPayload) => httpPost<Category>("/categories", payload),
  updateCategory: (id: string, payload: UpdateCategoryPayload) =>
    httpPut<Category>(`/categories/${id}`, payload),
  deleteCategory: (id: string) => httpDelete<void>(`/categories/${id}`),
  assignAttribute: (categoryId: string, payload: AssignAttributePayload) =>
    httpPost<void>(`/categories/${categoryId}/attributes`, payload),
  unassignAttribute: (categoryId: string, attributeId: string) =>
    httpDelete<void>(`/categories/${categoryId}/attributes/${attributeId}`),

  // ── Attributes ─────────────────────────────────────────────────────────
  getAttributes: (signal?: AbortSignal) => httpGet<Attribute[]>("/attributes", { signal }),
  getAttribute: (id: string, signal?: AbortSignal) =>
    httpGet<Attribute>(`/attributes/${id}`, { signal }),
  createAttribute: (payload: CreateAttributePayload) => httpPost<Attribute>("/attributes", payload),
  updateAttribute: (id: string, payload: UpdateAttributePayload) =>
    httpPut<Attribute>(`/attributes/${id}`, payload),
  deleteAttribute: (id: string) => httpDelete<void>(`/attributes/${id}`),
  getAttributeOptions: (id: string, signal?: AbortSignal) =>
    httpGet<AttributeOption[]>(`/attributes/${id}/options`, { signal }),
  addAttributeOption: (id: string, payload: AddAttributeOptionPayload) =>
    httpPost<AttributeOption>(`/attributes/${id}/options`, payload),

  // ── Brands ─────────────────────────────────────────────────────────────
  getBrands: (signal?: AbortSignal) => httpGet<Brand[]>("/brands", { signal }),
  getBrand: (id: string, signal?: AbortSignal) => httpGet<Brand>(`/brands/${id}`, { signal }),
  createBrand: (payload: CreateBrandPayload) => httpPost<Brand>("/brands", payload),
  updateBrand: (id: string, payload: UpdateBrandPayload) =>
    httpPut<Brand>(`/brands/${id}`, payload),
  deleteBrand: (id: string) => httpDelete<void>(`/brands/${id}`),

  // ── Products ───────────────────────────────────────────────────────────
  getProducts: (params?: PaginationParams & Record<string, unknown>, signal?: AbortSignal) =>
    httpGet<Paginated<ProductSummary>>("/products", { params, signal }),
  searchProducts: (params: ProductSearchParams, signal?: AbortSignal) =>
    httpGet<CursorPage<ProductSummary>>("/products/search", { params, signal }),
  getProductBySlug: (slug: string, signal?: AbortSignal) =>
    httpGet<ProductDetail>(`/products/${slug}`, { signal }),
  getProductDetail: (id: string, signal?: AbortSignal) =>
    httpGet<ProductDetail>(`/products/${id}/detail`, { signal }),
  createProduct: (payload: CreateProductPayload) => httpPost<ProductDetail>("/products", payload),
  updateProduct: (id: string, payload: UpdateProductPayload) =>
    httpPut<ProductDetail>(`/products/${id}`, payload),
  deleteProduct: (id: string) => httpDelete<void>(`/products/${id}`),
  publishProduct: (id: string) => httpPost<ProductDetail>(`/products/${id}/publish`),
  unpublishProduct: (id: string) => httpPost<ProductDetail>(`/products/${id}/unpublish`),
  setAttributeValues: (id: string, payload: SetAttributeValuesPayload) =>
    httpPost<void>(`/products/${id}/attribute-values`, payload),

  // ── Variants ───────────────────────────────────────────────────────────
  getVariants: (productId: string, signal?: AbortSignal) =>
    httpGet<Variant[]>(`/products/${productId}/variants`, { signal }),
  generateVariants: (productId: string, payload: GenerateVariantsPayload) =>
    httpPost<Variant[]>(`/products/${productId}/variants`, payload),
  updateVariant: (variantId: string, payload: Partial<Variant>) =>
    httpPut<Variant>(`/variants/${variantId}`, payload),
  deleteVariant: (variantId: string) => httpDelete<void>(`/variants/${variantId}`),

  // ── Media ──────────────────────────────────────────────────────────────
  getProductMedia: (productId: string, signal?: AbortSignal) =>
    httpGet<ProductMedia[]>(`/products/${productId}/media`, { signal }),
  uploadMedia: (productId: string, formData: FormData) =>
    httpPost<ProductMedia>(`/products/${productId}/media`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  presignMedia: (productId: string, payload: PresignMediaPayload) =>
    httpPost<{ url: string; key: string }>(`/products/${productId}/media/presign`, payload),
  recordMedia: (productId: string, payload: RecordMediaPayload) =>
    httpPost<ProductMedia>(`/products/${productId}/media/record`, payload),
  updateMedia: (mediaId: string, payload: UpdateMediaPayload) =>
    httpPut<ProductMedia>(`/media/${mediaId}`, payload),
  deleteMedia: (mediaId: string) => httpDelete<void>(`/media/${mediaId}`),
};
