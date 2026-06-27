import type { AxiosRequestConfig } from "axios";

import { apiClient } from "./api-client";

/**
 * Thin typed wrappers over the shared api-client so services read declaratively
 * and always return `response.data`. Pass `{ signal }` for cancellation and
 * `{ params }` for query strings.
 */
export function httpGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.get<T>(url, config).then((r) => r.data);
}

export function httpPost<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.post<T>(url, data, config).then((r) => r.data);
}

export function httpPut<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.put<T>(url, data, config).then((r) => r.data);
}

export function httpPatch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.patch<T>(url, data, config).then((r) => r.data);
}

export function httpDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.delete<T>(url, config).then((r) => r.data);
}
