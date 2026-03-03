import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitProviderJobOrderReport } from "@/api/services/providerService";

export default function useSubmitJobOrderReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobOrderId,
      reportId,
    }: { jobOrderId: string | number; reportId: number | string }) =>
      submitProviderJobOrderReport(jobOrderId, reportId),
    onSuccess: (_, { jobOrderId }) => {
      queryClient.invalidateQueries({
        queryKey: ["provider-job-order-reports", String(jobOrderId)],
      });
      queryClient.invalidateQueries({ queryKey: ["provider-job-order", String(jobOrderId)] });
    },
  });
}
