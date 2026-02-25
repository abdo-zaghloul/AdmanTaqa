import { useQuery } from "@tanstack/react-query";
import { fetchWorkOrders } from "@/api/services/workOrderService";
import type { WorkOrdersQuery } from "@/types/workOrder";

export default function useGetWorkOrders(query: WorkOrdersQuery) {
  return useQuery({
    queryKey: ["work-orders", query],
    queryFn: () => fetchWorkOrders(query),
  });
}
