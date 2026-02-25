import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInternalTaskStatus } from "@/api/services/internalTaskService";
import type { UpdateInternalTaskStatusBody } from "@/types/internalTask";

type Payload = {
  id: number | string;
  body: UpdateInternalTaskStatusBody;
  workOrderId?: number | string;
};

export default function useUpdateInternalTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: Payload) => updateInternalTaskStatus(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["internal-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      if (variables.workOrderId != null) {
        queryClient.invalidateQueries({ queryKey: ["work-order", variables.workOrderId] });
      }
    },
  });
}
