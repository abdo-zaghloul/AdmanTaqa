import { useQuery } from "@tanstack/react-query";
import { fetchJobOrderReviewQueue } from "@/api/services/jobOrderService";

export default function useGetJobOrderReviewQueue(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["provider-job-orders", "review-queue", params?.page, params?.limit],
    queryFn: () => fetchJobOrderReviewQueue(params),
  });
}
