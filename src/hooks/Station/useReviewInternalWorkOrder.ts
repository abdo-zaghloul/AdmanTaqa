import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewInternalWorkOrder } from "@/api/services/internalWorkOrderService";
import type { ReviewInternalWorkOrderBody } from "@/types/internalWorkOrder";

export default function useReviewInternalWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: ReviewInternalWorkOrderBody }) =>
      reviewInternalWorkOrder(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["internal-work-order", id] });
      queryClient.invalidateQueries({ queryKey: ["internal-work-orders"] });
    },
  });
}
