import { useQuery } from "@tanstack/react-query";
import { fetchInternalWorkOrderReviewQueue } from "@/api/services/internalWorkOrderService";

export default function useInternalWorkOrderReviewQueue(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["internal-work-orders", "review-queue", params?.page, params?.limit],
    queryFn: () => fetchInternalWorkOrderReviewQueue(params),
  });
}
