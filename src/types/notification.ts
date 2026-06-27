export type NotificationChannel = "EMAIL" | "SMS" | "PUSH";

export interface NotificationItem {
  id: string;
  channel: NotificationChannel | string;
  subject?: string | null;
  body: string;
  status?: string;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationPreferences {
  marketingEmail?: boolean;
  marketingSms?: boolean;
  marketingPush?: boolean;
}

export interface NotificationTemplate {
  key: string;
  channel: NotificationChannel | string;
  subject?: string | null;
  body: string;
  isActive?: boolean;
}

export interface UpdateTemplatePayload {
  subject?: string;
  body?: string;
  isActive?: boolean;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
  userId?: string | null;
}
export interface SendSmsPayload {
  to: string;
  body: string;
  userId?: string | null;
}
export interface SendPushPayload {
  to: string;
  subject?: string;
  body: string;
  userId?: string | null;
}
