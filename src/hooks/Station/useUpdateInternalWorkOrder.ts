import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInternalWorkOrder } from "@/api/services/internalWorkOrderService";
import type { UpdateInternalWorkOrderBody } from "@/types/internalWorkOrder";

export default function useUpdateInternalWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: UpdateInternalWorkOrderBody }) =>
      updateInternalWorkOrder(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["internal-work-order", id] });
      queryClient.invalidateQueries({ queryKey: ["internal-work-orders"] });
      queryClient.invalidateQueries({ queryKey: ["internal-work-order-review-queue"] });
    },
  });
}
