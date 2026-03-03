import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectStationJobOrder } from "@/api/services/stationService";

export default function useRejectStationJobOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobOrderId, body }: { jobOrderId: number | string; body?: { reason?: string } }) =>
      rejectStationJobOrder(jobOrderId, body ?? {}),
    onSuccess: (_, { jobOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ["station-job-orders"] });
      queryClient.invalidateQueries({ queryKey: ["station-job-order", String(jobOrderId)] });
      queryClient.invalidateQueries({ queryKey: ["station-requests"] });
    },
  });
}
