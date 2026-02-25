import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewInternalTask } from "@/api/services/internalTaskService";
import type { ReviewInternalTaskBody } from "@/types/internalTask";

type Payload = {
  id: number | string;
  body: ReviewInternalTaskBody;
  workOrderId?: number | string;
};

export default function useReviewInternalTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: Payload) => reviewInternalTask(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["internal-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["internal-tasks", "review-queue"] });
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      if (variables.workOrderId != null) {
        queryClient.invalidateQueries({ queryKey: ["work-order", variables.workOrderId] });
      }
    },
  });
}
