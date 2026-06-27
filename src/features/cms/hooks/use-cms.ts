"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { cmsService } from "@/services/cms.service";

export function useActivePopups() {
  return useQuery({
    queryKey: queryKeys.cms.popups,
    queryFn: ({ signal }) => cmsService.getActivePopups(signal),
    staleTime: 5 * 60 * 1000,
  });
}
