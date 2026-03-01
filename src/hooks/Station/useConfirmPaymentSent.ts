import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmJobOrderPaymentSent } from "@/api/services/stationService";
import type { ConfirmSentBody } from "@/types/station";

export default function useConfirmPaymentSent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobOrderId,
      body,
    }: {
      jobOrderId: number | string;
      body?: ConfirmSentBody;
    }) => confirmJobOrderPaymentSent(jobOrderId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["station-requests"] });
      queryClient.invalidateQueries({ queryKey: ["station-request"] });
    },
  });
}
