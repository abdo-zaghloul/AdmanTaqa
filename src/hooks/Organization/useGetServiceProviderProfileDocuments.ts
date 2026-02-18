import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { ServiceProviderProfileDocumentsResponse } from "@/types/organization";

const getServiceProviderProfileDocuments = async (
  organizationId: number | string
) => {
  const response = await axiosInstance.get<ServiceProviderProfileDocumentsResponse>(
    `organizations/${organizationId}/service-provider-profile/documents`
  );
  return response.data?.data ?? [];
};

export default function useGetServiceProviderProfileDocuments(
  organizationId: number | string | null | undefined,
  enabled?: boolean
) {
  return useQuery({
    queryKey: ["serviceProviderProfileDocuments", organizationId],
    queryFn: () => getServiceProviderProfileDocuments(organizationId!),
    enabled:
      (enabled ?? true) &&
      organizationId != null &&
      organizationId !== "",
  });
}
