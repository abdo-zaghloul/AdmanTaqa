import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type {
  ServiceOfferingsFilter,
  ServiceOfferingsListResponse,
} from "@/types/organization";

const getServiceOfferings = async (
  organizationId: number | string,
  filters?: ServiceOfferingsFilter
): Promise<ServiceOfferingsListResponse> => {
  const searchParams = new URLSearchParams();
  if (filters?.serviceCategoryId != null) {
    searchParams.set("serviceCategoryId", String(filters.serviceCategoryId));
  }
  if (filters?.cityId != null) {
    searchParams.set("cityId", String(filters.cityId));
  }
  if (filters?.governorateId != null) {
    searchParams.set("governorateId", String(filters.governorateId));
  }
  const query = searchParams.toString();
  const url = query
    ? `organizations/${organizationId}/service-offerings?${query}`
    : `organizations/${organizationId}/service-offerings`;

  const response = await axiosInstance.get<ServiceOfferingsListResponse>(url);
  return response.data;
};

export default function useGetServiceOfferings(
  organizationId: number | string | null | undefined,
  filters?: ServiceOfferingsFilter
) {
  return useQuery({
    queryKey: ["service-offerings", organizationId, filters],
    queryFn: () => getServiceOfferings(organizationId!, filters),
    enabled: organizationId != null && organizationId !== "",
  });
}
