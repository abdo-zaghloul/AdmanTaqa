import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkOrder } from "@/api/services/workOrderService";
import type { UpdateWorkOrderBody } from "@/types/workOrder";

type Payload = {
  id: number | string;
  body: UpdateWorkOrderBody;
};

export default function useUpdateWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: Payload) => updateWorkOrder(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      queryClient.invalidateQueries({ queryKey: ["work-order", id] });
    },
  });
}
