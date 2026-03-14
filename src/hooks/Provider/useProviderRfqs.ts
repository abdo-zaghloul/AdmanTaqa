import { useQuery } from "@tanstack/react-query";
import { fetchProviderRfqs } from "@/api/services/providerService";

export default function useProviderRfqs(params?: {
  status?: string;
  title?: string;
  priority?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["provider-rfqs", params?.status, params?.title, params?.priority, params?.page, params?.limit],
    queryFn: () => fetchProviderRfqs(params),
  });
}
