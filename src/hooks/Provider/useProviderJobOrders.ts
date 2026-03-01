import { useQuery } from "@tanstack/react-query";
import { fetchProviderJobOrders } from "@/api/services/providerService";

export default function useProviderJobOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["provider-job-orders", params?.status, params?.page, params?.limit],
    queryFn: () => fetchProviderJobOrders(params),
  });
}
