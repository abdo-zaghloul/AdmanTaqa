import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeInternalTask } from "@/api/services/internalTaskService";

type Payload = {
  id: number | string;
  note?: string;
  workOrderId?: number | string;
};

export default function useCloseInternalTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: Payload) => closeInternalTask(id, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["internal-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      if (variables.workOrderId != null) {
        queryClient.invalidateQueries({ queryKey: ["work-order", variables.workOrderId] });
      }
    },
  });
}
