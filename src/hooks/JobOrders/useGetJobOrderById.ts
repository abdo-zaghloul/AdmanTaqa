import { useQuery } from "@tanstack/react-query";
import { fetchJobOrderById } from "@/api/services/jobOrderService";

export default function useGetJobOrderById(
  id: number | string | null | undefined
) {
  return useQuery({
    queryKey: ["job-order", id],
    queryFn: () => fetchJobOrderById(id!),
    enabled: id != null && id !== "",
  });
}
