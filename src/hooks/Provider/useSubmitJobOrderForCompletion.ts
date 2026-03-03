import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitProviderJobOrderForCompletion } from "@/api/services/providerService";

export default function useSubmitJobOrderForCompletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobOrderId: string | number) =>
      submitProviderJobOrderForCompletion(jobOrderId),
    onSuccess: (_, jobOrderId) => {
      queryClient.invalidateQueries({ queryKey: ["provider-job-order", String(jobOrderId)] });
      queryClient.invalidateQueries({ queryKey: ["provider-job-orders"] });
    },
  });
}
