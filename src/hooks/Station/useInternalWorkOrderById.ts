import { useQuery } from "@tanstack/react-query";
import { fetchInternalWorkOrderById } from "@/api/services/internalWorkOrderService";

export default function useInternalWorkOrderById(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["internal-work-order", id],
    queryFn: () => fetchInternalWorkOrderById(id!),
    enabled: id != null && id !== "",
  });
}
