import { useQuery } from "@tanstack/react-query";
import { fetchProviderJobOrderAttachments } from "@/api/services/providerService";

export default function useProviderJobOrderAttachments(jobOrderId: string | null | undefined) {
  return useQuery({
    queryKey: ["provider-job-order-attachments", jobOrderId],
    queryFn: () => fetchProviderJobOrderAttachments(jobOrderId!),
    enabled: !!jobOrderId,
  });
}
