import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { OrganizationDocumentsResponse } from "@/types/organization";

const getOrganizationDocuments = async (organizationId: number) => {
  const response = await axiosInstance.get<OrganizationDocumentsResponse>(
    `organizations/${organizationId}/documents`
  );
  return response.data?.data ?? [];
};

export default function useGetOrganizationDocuments(organizationId: number | null | undefined) {
  return useQuery({
    queryKey: ["organization", organizationId, "documents"],
    queryFn: () => getOrganizationDocuments(organizationId!),
    enabled: organizationId != null && organizationId > 0,
  });
}
