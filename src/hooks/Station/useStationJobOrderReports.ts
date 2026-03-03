import { useQuery } from "@tanstack/react-query";
import { fetchStationJobOrderReports } from "@/api/services/stationService";

export default function useStationJobOrderReports(jobOrderId: string | null | undefined) {
  return useQuery({
    queryKey: ["station-job-order-reports", jobOrderId],
    queryFn: () => fetchStationJobOrderReports(jobOrderId!),
    enabled: jobOrderId != null && jobOrderId !== "",
  });
}
