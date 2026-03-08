import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignProviderJobOrderOperator } from "@/api/services/providerService";

export default function useAssignProviderJobOrderOperator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobOrderId,
      operatorId,
    }: {
      jobOrderId: number | string;
      operatorId: number;
    }) => assignProviderJobOrderOperator(jobOrderId, { operatorId }),
    onSuccess: (_, { jobOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ["provider-job-order", jobOrderId] });
      queryClient.invalidateQueries({ queryKey: ["provider-job-orders"] });
    },
  });
}
