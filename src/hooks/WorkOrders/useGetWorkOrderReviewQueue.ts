import { useQuery } from "@tanstack/react-query";
import { fetchWorkOrderReviewQueue } from "@/api/services/workOrderService";

export default function useGetWorkOrderReviewQueue(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["work-orders", "review-queue", page, limit],
    queryFn: () => fetchWorkOrderReviewQueue(page, limit),
  });
}
