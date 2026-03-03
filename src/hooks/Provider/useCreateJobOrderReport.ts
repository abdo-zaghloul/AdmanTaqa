import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProviderJobOrderReport } from "@/api/services/providerService";
import type { CreateProviderReportBody } from "@/types/provider";

export default function useCreateJobOrderReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobOrderId,
      body,
    }: {
      jobOrderId: string | number;
      body: CreateProviderReportBody;
    }) => createProviderJobOrderReport(jobOrderId, body),
    onSuccess: (_, { jobOrderId }) => {
      queryClient.invalidateQueries({
        queryKey: ["provider-job-order-reports", String(jobOrderId)],
      });
      queryClient.invalidateQueries({ queryKey: ["provider-job-order", String(jobOrderId)] });
    },
  });
}
