import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProviderJobOrderVisitCheckin } from "@/api/services/providerService";

export default function useProviderJobOrderVisitCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobOrderId,
      body,
    }: {
      jobOrderId: string | number;
      body?: { notes?: string };
    }) => createProviderJobOrderVisitCheckin(jobOrderId, body),
    onSuccess: (_, { jobOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ["provider-job-order-visits", String(jobOrderId)] });
      queryClient.invalidateQueries({ queryKey: ["provider-job-order", String(jobOrderId)] });
    },
  });
}
