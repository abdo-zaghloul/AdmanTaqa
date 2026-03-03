import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveReport } from "@/api/services/stationService";

export default function useApproveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId: number | string) => approveReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["station-job-order-reports"] });
      queryClient.invalidateQueries({ queryKey: ["station-job-order"] });
    },
  });
}
