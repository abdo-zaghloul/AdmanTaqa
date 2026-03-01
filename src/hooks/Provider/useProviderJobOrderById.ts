import { useQuery } from "@tanstack/react-query";
import { fetchProviderJobOrderById } from "@/api/services/providerService";

export default function useProviderJobOrderById(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["provider-job-order", id],
    queryFn: () => fetchProviderJobOrderById(id!),
    enabled: id != null && id !== "",
  });
}
