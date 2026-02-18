import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { OrganizationServiceCategoriesResponse } from "@/types/organization";

const getOrganizationServiceCategories = async (organizationId: number) => {
  const response = await axiosInstance.get<OrganizationServiceCategoriesResponse>(
    `organizations/${organizationId}/service-categories`
  );
  return response.data?.data ?? [];
};

export default function useGetOrganizationServiceCategories(
  organizationId: number | null | undefined
) {
  return useQuery({
    queryKey: ["organization", organizationId, "service-categories"],
    queryFn: () => getOrganizationServiceCategories(organizationId!),
    enabled: organizationId != null && organizationId > 0,
  });
}
