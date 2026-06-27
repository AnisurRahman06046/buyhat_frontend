import type {
  Banner,
  CreateBannerPayload,
  CreateLandingPagePayload,
  CreatePopupPayload,
  CreateSectionPayload,
  Homepage,
  HomepageSection,
  LandingPage,
  Popup,
  ReorderSectionsPayload,
  UpdateBannerPayload,
  UpdateLandingPagePayload,
  UpdatePopupPayload,
  UpdateSectionPayload,
} from "@/types/cms";

import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from "./http";

export const cmsService = {
  // ── Public homepage ──────────────────────────────────────────────────────
  getHomepage: (signal?: AbortSignal) => httpGet<Homepage>("/cms/homepage", { signal }),

  // ── Homepage sections (admin) ────────────────────────────────────────────
  getSections: (signal?: AbortSignal) =>
    httpGet<HomepageSection[]>("/cms/homepage/sections", { signal }),
  createSection: (payload: CreateSectionPayload) =>
    httpPost<HomepageSection>("/cms/homepage/sections", payload),
  updateSection: (id: string, payload: UpdateSectionPayload) =>
    httpPatch<HomepageSection>(`/cms/homepage/sections/${id}`, payload),
  deleteSection: (id: string) => httpDelete<void>(`/cms/homepage/sections/${id}`),
  reorderSections: (payload: ReorderSectionsPayload) =>
    httpPut<void>("/cms/homepage/order", payload),

  // ── Banners ──────────────────────────────────────────────────────────────
  getActiveBanners: (placement?: string, signal?: AbortSignal) =>
    httpGet<Banner[]>("/cms/banners/active", {
      params: placement ? { placement } : undefined,
      signal,
    }),
  listBanners: (signal?: AbortSignal) => httpGet<Banner[]>("/cms/banners", { signal }),
  getBanner: (id: string, signal?: AbortSignal) =>
    httpGet<Banner>(`/cms/banners/${id}`, { signal }),
  createBanner: (payload: CreateBannerPayload) => httpPost<Banner>("/cms/banners", payload),
  updateBanner: (id: string, payload: UpdateBannerPayload) =>
    httpPatch<Banner>(`/cms/banners/${id}`, payload),
  deleteBanner: (id: string) => httpDelete<void>(`/cms/banners/${id}`),

  // ── Popups ───────────────────────────────────────────────────────────────
  getActivePopups: (signal?: AbortSignal) => httpGet<Popup[]>("/cms/popups/active", { signal }),
  listPopups: (signal?: AbortSignal) => httpGet<Popup[]>("/cms/popups", { signal }),
  getPopup: (id: string, signal?: AbortSignal) => httpGet<Popup>(`/cms/popups/${id}`, { signal }),
  createPopup: (payload: CreatePopupPayload) => httpPost<Popup>("/cms/popups", payload),
  updatePopup: (id: string, payload: UpdatePopupPayload) =>
    httpPatch<Popup>(`/cms/popups/${id}`, payload),
  deletePopup: (id: string) => httpDelete<void>(`/cms/popups/${id}`),

  // ── Landing pages ────────────────────────────────────────────────────────
  listLandingPages: (signal?: AbortSignal) =>
    httpGet<LandingPage[]>("/cms/landing-pages", { signal }),
  getLandingPage: (slug: string, signal?: AbortSignal) =>
    httpGet<LandingPage>(`/cms/landing-pages/${slug}`, { signal }),
  createLandingPage: (payload: CreateLandingPagePayload) =>
    httpPost<LandingPage>("/cms/landing-pages", payload),
  updateLandingPage: (id: string, payload: UpdateLandingPagePayload) =>
    httpPatch<LandingPage>(`/cms/landing-pages/${id}`, payload),
  deleteLandingPage: (id: string) => httpDelete<void>(`/cms/landing-pages/${id}`),
};
