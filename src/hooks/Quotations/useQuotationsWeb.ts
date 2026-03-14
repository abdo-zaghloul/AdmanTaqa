import { useQuery } from "@tanstack/react-query";
import {
  fetchQuotationsWebList,
  fetchQuotationsWebById,
} from "@/api/services/quotationsWebService";
import type { QuotationsWebListParams, QuotationsWebStatus } from "@/types/quotationsWeb";

export function useQuotationsWebList(
  params: QuotationsWebListParams = {},
  options?: { enabled?: boolean }
) {
  const { page = 1, limit = 20, status } = params;
  return useQuery({
    queryKey: ["quotations-web", page, limit, status],
    queryFn: () => fetchQuotationsWebList({ page, limit, status }),
    enabled: options?.enabled ?? true,
  });
}

export function useQuotationsWebById(id: number | string | null) {
  return useQuery({
    queryKey: ["quotations-web", id],
    queryFn: () => fetchQuotationsWebById(id!),
    enabled: id != null && id !== "",
  });
}

export type { QuotationsWebStatus };
