import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInternalTask } from "@/api/services/internalTaskService";

export default function useCreateInternalTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInternalTask,
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["internal-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["work-order", task.workOrderId] });
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
    },
  });
}
