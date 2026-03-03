import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveStationJobOrder } from "@/api/services/stationService";

export default function useApproveStationJobOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobOrderId: number | string) => approveStationJobOrder(jobOrderId),
    onSuccess: (_data, jobOrderId) => {
      queryClient.invalidateQueries({ queryKey: ["station-job-orders"] });
      queryClient.invalidateQueries({ queryKey: ["station-job-order", String(jobOrderId)] });
      queryClient.invalidateQueries({ queryKey: ["station-requests"] });
    },
  });
}
