import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitProviderJobOrderForCompletion } from "@/api/services/providerService";

export default function useSubmitJobOrderForCompletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobOrderId,
      body,
    }: {
      jobOrderId: string | number;
      body?: { completionNote?: string };
    }) => submitProviderJobOrderForCompletion(jobOrderId, body),
    onSuccess: (_, { jobOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ["provider-job-order", String(jobOrderId)] });
      queryClient.invalidateQueries({ queryKey: ["provider-job-orders"] });
      queryClient.invalidateQueries({ queryKey: ["job-orders-web"] });
    },
  });
}
