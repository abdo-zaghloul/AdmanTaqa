import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProviderJobOrderStatus } from "@/api/services/providerService";

export default function useUpdateProviderJobOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobOrderId,
      body,
    }: {
      jobOrderId: number | string;
      body: { status: string; cancellationReason?: string };
    }) => updateProviderJobOrderStatus(jobOrderId, body),
    onSuccess: (_, { jobOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ["provider-job-order", jobOrderId] });
      queryClient.invalidateQueries({ queryKey: ["provider-job-orders"] });
    },
  });
}
