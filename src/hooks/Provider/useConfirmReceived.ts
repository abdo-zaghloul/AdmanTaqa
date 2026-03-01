import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmJobOrderPaymentReceived } from "@/api/services/providerService";
import type { ConfirmReceivedBody } from "@/types/provider";

export default function useConfirmReceived() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobOrderId,
      body,
    }: {
      jobOrderId: number | string;
      body: ConfirmReceivedBody;
    }) => confirmJobOrderPaymentReceived(jobOrderId, body),
    onSuccess: (_, { jobOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ["provider-job-order", jobOrderId] });
      queryClient.invalidateQueries({ queryKey: ["provider-job-orders"] });
    },
  });
}
