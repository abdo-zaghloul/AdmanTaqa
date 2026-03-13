import { useQuery } from "@tanstack/react-query";
import { fetchAuthorityExternalJobOrders } from "@/api/services/authorityExternalJobOrderService";
import type { AuthorityExternalJobOrdersListParams } from "@/types/authorityExternalJobOrder";

export default function useAuthorityExternalJobOrders(params?: AuthorityExternalJobOrdersListParams) {
  return useQuery({
    queryKey: [
      "authority-external-job-orders",
      params?.page,
      params?.limit,
      params?.status,
      params?.fromDate,
      params?.toDate,
      params?.datePreset,
      params?.branchId,
      params?.fuelStationOrganizationId,
      params?.fuelStationOrganizationName,
      params?.serviceProviderOrganizationName,
      params?.providerOrganizationId,
      params?.serviceCategoryId,
    ],
    queryFn: () => fetchAuthorityExternalJobOrders(params),
  });
}
