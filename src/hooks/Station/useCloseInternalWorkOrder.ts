import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeInternalWorkOrder } from "@/api/services/internalWorkOrderService";

export default function useCloseInternalWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => closeInternalWorkOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["internal-work-order", id] });
      queryClient.invalidateQueries({ queryKey: ["internal-work-orders"] });
    },
  });
}
