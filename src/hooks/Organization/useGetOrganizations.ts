import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { OrganizationsListResponse } from "@/types/organization";

export interface GetOrganizationsParams {
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

const getOrganizations = async (
  params?: GetOrganizationsParams
): Promise<OrganizationsListResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.type) searchParams.set("type", params.type);
  if (params?.page != null) searchParams.set("page", String(params.page));
  if (params?.limit != null) searchParams.set("limit", String(params.limit));
  const query = searchParams.toString();
  const url = query ? `organizations?${query}` : "organizations";
  const response = await axiosInstance.get<OrganizationsListResponse>(url);
  return response.data;
};

export default function useGetOrganizations(params?: GetOrganizationsParams) {
  return useQuery({
    queryKey: ["organizations", params],
    queryFn: () => getOrganizations(params),
  });
}
