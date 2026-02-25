import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewWorkOrder } from "@/api/services/workOrderService";
import type { ReviewWorkOrderBody } from "@/types/workOrder";

type Payload = {
  id: number | string;
  body: ReviewWorkOrderBody;
};

export default function useReviewWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: Payload) => reviewWorkOrder(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      queryClient.invalidateQueries({ queryKey: ["work-order", id] });
      queryClient.invalidateQueries({ queryKey: ["work-orders", "review-queue"] });
    },
  });
}
