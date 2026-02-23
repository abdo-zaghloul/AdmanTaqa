import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { OrganizationServiceCategoriesResponse } from "@/types/organization";

const getOrganizationServiceCategories = async (organizationId: number) => {
  try {
    const response = await axiosInstance.get<OrganizationServiceCategoriesResponse>(
      `organizations/${organizationId}/service-categories`
    );
    return response.data?.data ?? [];
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to fetch organization service categories.";
    throw new Error(message);
  }
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
