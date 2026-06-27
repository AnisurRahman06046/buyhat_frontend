"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/config/query-keys";
import { userService } from "@/services/user.service";
import type { UpdateProfilePayload } from "@/types/user";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: ({ signal }) => userService.getProfile(signal),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userService.updateProfile(payload),
    meta: { silentError: true },
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.user.profile, profile);
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
      toast.success("Profile updated");
    },
  });
}
