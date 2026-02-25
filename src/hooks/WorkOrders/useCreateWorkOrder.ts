import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkOrder } from "@/api/services/workOrderService";

export default function useCreateWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
    },
  });
}
