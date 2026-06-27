import type { Paginated, PaginationParams } from "@/types/common";
import type {
  Address,
  AddressPayload,
  SetDefaultAddressPayload,
  UpdateProfilePayload,
  UpdateUserRolesPayload,
  UpdateUserStatusPayload,
  UserProfile,
} from "@/types/user";

import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from "./http";

export const userService = {
  getProfile: (signal?: AbortSignal) => httpGet<UserProfile>("/users/me", { signal }),

  updateProfile: (payload: UpdateProfilePayload) => httpPatch<UserProfile>("/users/me", payload),

  // ── Addresses ──────────────────────────────────────────────────────────
  getAddresses: (signal?: AbortSignal) => httpGet<Address[]>("/users/me/addresses", { signal }),

  addAddress: (payload: AddressPayload) => httpPost<Address>("/users/me/addresses", payload),

  updateAddress: (id: string, payload: Partial<AddressPayload>) =>
    httpPatch<Address>(`/users/me/addresses/${id}`, payload),

  deleteAddress: (id: string) => httpDelete<void>(`/users/me/addresses/${id}`),

  setDefaultAddress: (id: string, payload: SetDefaultAddressPayload) =>
    httpPut<Address>(`/users/me/addresses/${id}/default`, payload),

  // ── Admin ──────────────────────────────────────────────────────────────
  listUsers: (params?: PaginationParams, signal?: AbortSignal) =>
    httpGet<Paginated<UserProfile>>("/users", { params, signal }),

  getUser: (id: string, signal?: AbortSignal) => httpGet<UserProfile>(`/users/${id}`, { signal }),

  updateUserStatus: (id: string, payload: UpdateUserStatusPayload) =>
    httpPatch<UserProfile>(`/users/${id}/status`, payload),

  updateUserRoles: (id: string, payload: UpdateUserRolesPayload) =>
    httpPatch<UserProfile>(`/users/${id}/roles`, payload),
};
