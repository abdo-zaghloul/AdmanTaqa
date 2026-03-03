import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectReport } from "@/api/services/stationService";

export default function useRejectReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, body }: { reportId: number | string; body?: { reason?: string } }) =>
      rejectReport(reportId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["station-job-order-reports"] });
      queryClient.invalidateQueries({ queryKey: ["station-job-order"] });
    },
  });
}
