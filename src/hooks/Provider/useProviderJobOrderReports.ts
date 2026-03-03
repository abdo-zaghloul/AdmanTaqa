import { useQuery } from "@tanstack/react-query";
import { fetchProviderJobOrderReports } from "@/api/services/providerService";

export default function useProviderJobOrderReports(jobOrderId: string | null | undefined) {
  return useQuery({
    queryKey: ["provider-job-order-reports", jobOrderId],
    queryFn: () => fetchProviderJobOrderReports(jobOrderId!),
    enabled: !!jobOrderId,
  });
}
