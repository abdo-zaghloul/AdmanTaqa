import { useQuery } from "@tanstack/react-query";
import { fetchWorkOrderById } from "@/api/services/workOrderService";

export default function useGetWorkOrderById(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["work-order", id],
    queryFn: () => fetchWorkOrderById(id!),
    enabled: id != null && id !== "",
  });
}
