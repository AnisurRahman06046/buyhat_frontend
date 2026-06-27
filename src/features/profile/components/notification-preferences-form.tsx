"use client";

import { Spinner } from "@/components/shared/spinner";
import { Switch } from "@/components/ui/switch";
import type { NotificationPreferences } from "@/types/notification";

import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from "../hooks/use-notification-preferences";

const ROWS: { key: keyof NotificationPreferences; label: string; description: string }[] = [
  { key: "marketingEmail", label: "Email", description: "Order updates and offers via email" },
  { key: "marketingSms", label: "SMS", description: "Text alerts for orders and promotions" },
  { key: "marketingPush", label: "Push", description: "Browser push notifications" },
];

export function NotificationPreferencesForm() {
  const { data: prefs, isLoading } = useNotificationPreferences();
  const update = useUpdateNotificationPreferences();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-8" />
      </div>
    );
  }

  const current: NotificationPreferences = prefs ?? {};

  return (
    <div className="max-w-xl space-y-3">
      {ROWS.map((row) => (
        <div
          key={row.key}
          className="border-border bg-card flex items-center justify-between rounded-md border p-4"
        >
          <div>
            <p className="text-foreground text-sm font-medium">{row.label}</p>
            <p className="text-muted-foreground text-xs">{row.description}</p>
          </div>
          <Switch
            checked={Boolean(current[row.key])}
            onCheckedChange={(value) => update.mutate({ ...current, [row.key]: value })}
            disabled={update.isPending}
            aria-label={row.label}
          />
        </div>
      ))}
    </div>
  );
}
