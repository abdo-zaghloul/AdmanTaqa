import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeWorkOrder } from "@/api/services/workOrderService";

type Payload = {
  id: number | string;
  note?: string;
};

export default function useCloseWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: Payload) => closeWorkOrder(id, note),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      queryClient.invalidateQueries({ queryKey: ["work-order", id] });
      queryClient.invalidateQueries({ queryKey: ["work-orders", "review-queue"] });
    },
  });
}
