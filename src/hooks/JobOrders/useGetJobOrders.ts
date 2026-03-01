import { useQuery } from "@tanstack/react-query";
import { fetchJobOrders, type GetJobOrdersParams } from "@/api/services/jobOrderService";

export default function useGetJobOrders(params?: GetJobOrdersParams) {
  return useQuery({
    queryKey: ["job-orders", params?.page, params?.limit, params?.status],
    queryFn: () => fetchJobOrders(params),
  });
}
