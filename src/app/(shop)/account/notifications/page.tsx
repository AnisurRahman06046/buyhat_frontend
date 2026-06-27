import type { Metadata } from "next";

import { NotificationPreferencesForm } from "@/features/profile/components/notification-preferences-form";

export const metadata: Metadata = {
  title: "Notifications",
  robots: { index: false, follow: false },
};

export default function NotificationsPage() {
  return (
    <div>
      <h1 className="text-headline-lg text-foreground mb-2">Notifications</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Choose how you&apos;d like to hear from us.
      </p>
      <NotificationPreferencesForm />
    </div>
  );
}
