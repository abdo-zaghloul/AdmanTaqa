import { useQuery } from "@tanstack/react-query";
import { fetchProviderRfqById } from "@/api/services/providerService";

export default function useProviderRfqById(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["provider-rfq", id],
    queryFn: () => fetchProviderRfqById(id!),
    enabled: id != null && id !== "",
  });
}
