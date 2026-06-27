"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/config/query-keys";
import { userService } from "@/services/user.service";
import type { AddressPayload, SetDefaultAddressPayload } from "@/types/user";

function useInvalidateAddresses() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses });
}

export function useAddresses() {
  return useQuery({
    queryKey: queryKeys.user.addresses,
    queryFn: ({ signal }) => userService.getAddresses(signal),
  });
}

export function useAddAddress() {
  const invalidate = useInvalidateAddresses();
  return useMutation({
    mutationFn: (payload: AddressPayload) => userService.addAddress(payload),
    meta: { silentError: true },
    onSuccess: () => invalidate(),
  });
}

export function useUpdateAddress() {
  const invalidate = useInvalidateAddresses();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AddressPayload> }) =>
      userService.updateAddress(id, payload),
    meta: { silentError: true },
    onSuccess: () => {
      invalidate();
      toast.success("Address updated");
    },
  });
}

export function useDeleteAddress() {
  const invalidate = useInvalidateAddresses();
  return useMutation({
    mutationFn: (id: string) => userService.deleteAddress(id),
    onSuccess: () => {
      invalidate();
      toast.success("Address removed");
    },
  });
}

export function useSetDefaultAddress() {
  const invalidate = useInvalidateAddresses();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SetDefaultAddressPayload }) =>
      userService.setDefaultAddress(id, payload),
    onSuccess: () => {
      invalidate();
      toast.success("Default address updated");
    },
  });
}
