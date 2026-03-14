import { useQuery } from "@tanstack/react-query";
import { fetchJobOrdersWebList } from "@/api/services/jobOrdersWebService";
import type { JobOrdersWebListParams } from "@/types/jobOrdersWeb";

export function useJobOrdersWebList(
  params: JobOrdersWebListParams = {},
  options?: { enabled?: boolean }
) {
  const { page = 1, limit = 20, status } = params;
  return useQuery({
    queryKey: ["job-orders-web", page, limit, status],
    queryFn: () => fetchJobOrdersWebList({ page, limit, status }),
    enabled: options?.enabled ?? true,
  });
}
