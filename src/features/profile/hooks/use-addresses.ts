"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { userService } from "@/services/user.service";
import type { AddressPayload } from "@/types/user";

export function useAddresses() {
  return useQuery({
    queryKey: queryKeys.user.addresses,
    queryFn: ({ signal }) => userService.getAddresses(signal),
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressPayload) => userService.addAddress(payload),
    meta: { silentError: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses });
    },
  });
}
