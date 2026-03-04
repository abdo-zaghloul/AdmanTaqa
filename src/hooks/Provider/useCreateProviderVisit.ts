import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProviderVisit } from "@/api/services/providerService";
import type { CreateProviderVisitBody } from "@/types/provider";

export default function useCreateProviderVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobOrderId,
      body,
    }: {
      jobOrderId: string | number;
      body: CreateProviderVisitBody;
    }) => createProviderVisit(jobOrderId, body),
    onSuccess: (_, { jobOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ["provider-job-order-visits", String(jobOrderId)] });
      queryClient.invalidateQueries({ queryKey: ["provider-job-order", String(jobOrderId)] });
    },
  });
}
