import type { Paginated, PaginationParams } from "@/types/common";
import type {
  NotificationItem,
  NotificationPreferences,
  NotificationTemplate,
  SendEmailPayload,
  SendPushPayload,
  SendSmsPayload,
  UpdateTemplatePayload,
} from "@/types/notification";

import { httpGet, httpPatch, httpPost, httpPut } from "./http";

export const notificationService = {
  list: (params?: PaginationParams, signal?: AbortSignal) =>
    httpGet<Paginated<NotificationItem>>("/notifications", { params, signal }),

  getPreferences: (signal?: AbortSignal) =>
    httpGet<NotificationPreferences>("/notifications/preferences", { signal }),

  updatePreferences: (payload: NotificationPreferences) =>
    httpPut<NotificationPreferences>("/notifications/preferences", payload),

  // ── Templates (admin) ────────────────────────────────────────────────────
  getTemplates: (signal?: AbortSignal) =>
    httpGet<NotificationTemplate[]>("/notifications/templates", { signal }),

  updateTemplate: (key: string, payload: UpdateTemplatePayload) =>
    httpPatch<NotificationTemplate>(`/notifications/templates/${encodeURIComponent(key)}`, payload),

  // ── Manual sends (admin) ─────────────────────────────────────────────────
  sendEmail: (payload: SendEmailPayload) => httpPost<void>("/notifications/email", payload),
  sendSms: (payload: SendSmsPayload) => httpPost<void>("/notifications/sms", payload),
  sendPush: (payload: SendPushPayload) => httpPost<void>("/notifications/push", payload),
};
