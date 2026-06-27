"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/config/query-keys";
import { notificationService } from "@/services/notification.service";
import type { NotificationPreferences } from "@/types/notification";

export function useNotificationPreferences() {
  return useQuery({
    queryKey: queryKeys.notifications.preferences,
    queryFn: ({ signal }) => notificationService.getPreferences(signal),
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NotificationPreferences) =>
      notificationService.updatePreferences(payload),
    meta: { silentError: true },
    onSuccess: (prefs) => {
      queryClient.setQueryData(queryKeys.notifications.preferences, prefs);
      toast.success("Preferences saved");
    },
  });
}
