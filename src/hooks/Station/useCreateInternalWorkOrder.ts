import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInternalWorkOrder } from "@/api/services/internalWorkOrderService";
import type { CreateInternalWorkOrderBody } from "@/types/internalWorkOrder";

export default function useCreateInternalWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateInternalWorkOrderBody) => createInternalWorkOrder(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internal-work-orders"] });
      queryClient.invalidateQueries({ queryKey: ["internal-work-order-review-queue"] });
    },
  });
}
