import { useQuery } from "@tanstack/react-query";
import { fetchProviderRfqs } from "@/api/services/providerService";

export default function useProviderRfqs(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["provider-rfqs", params?.status, params?.page, params?.limit],
    queryFn: () => fetchProviderRfqs(params),
  });
}
