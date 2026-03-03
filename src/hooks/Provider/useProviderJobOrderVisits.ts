import { useQuery } from "@tanstack/react-query";
import { fetchProviderJobOrderVisits } from "@/api/services/providerService";

export default function useProviderJobOrderVisits(jobOrderId: string | null | undefined) {
  return useQuery({
    queryKey: ["provider-job-order-visits", jobOrderId],
    queryFn: () => fetchProviderJobOrderVisits(jobOrderId!),
    enabled: !!jobOrderId,
  });
}
