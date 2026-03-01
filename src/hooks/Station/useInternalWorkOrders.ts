import { useQuery } from "@tanstack/react-query";
import { fetchInternalWorkOrders } from "@/api/services/internalWorkOrderService";
import type { InternalWorkOrderStatus } from "@/types/internalWorkOrder";

export default function useInternalWorkOrders(params?: {
  status?: InternalWorkOrderStatus | "all";
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["internal-work-orders", params?.status, params?.page, params?.limit],
    queryFn: () =>
      fetchInternalWorkOrders({
        status: params?.status === "all" ? undefined : params?.status,
        page: params?.page,
        limit: params?.limit,
      }),
  });
}
