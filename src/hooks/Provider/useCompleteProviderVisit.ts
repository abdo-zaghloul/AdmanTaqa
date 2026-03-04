import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeProviderVisit } from "@/api/services/providerService";

export default function useCompleteProviderVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      visitId,
      body,
    }: {
      visitId: string | number;
      jobOrderId?: string | number;
      body?: { completionNote?: string };
    }) => completeProviderVisit(visitId, body),
    onSuccess: (_, { jobOrderId }) => {
      if (jobOrderId != null) {
        queryClient.invalidateQueries({ queryKey: ["provider-job-order-visits", String(jobOrderId)] });
        queryClient.invalidateQueries({ queryKey: ["provider-job-order", String(jobOrderId)] });
      }
    },
  });
}
