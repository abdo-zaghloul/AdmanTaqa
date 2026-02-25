import { useQuery } from "@tanstack/react-query";
import { fetchInternalTaskReviewQueue } from "@/api/services/internalTaskService";

export default function useGetInternalTaskReviewQueue(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["internal-tasks", "review-queue", page, limit],
    queryFn: () => fetchInternalTaskReviewQueue(page, limit),
  });
}
