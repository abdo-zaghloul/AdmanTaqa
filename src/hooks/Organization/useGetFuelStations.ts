import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { OrganizationsListResponse } from "@/types/organization";

export interface GetFuelStationsParams {
  status?: "PENDING" | "APPROVED" | "REJECTED";
  page?: number;
  limit?: number;
}

async function getFuelStations(
  params?: GetFuelStationsParams
): Promise<OrganizationsListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.page != null) searchParams.set("page", String(params.page));
  if (params?.limit != null) searchParams.set("limit", String(params.limit));
  const query = searchParams.toString();
  const url = query ? `organizations/fuel-stations?${query}` : "organizations/fuel-stations";
  const response = await axiosInstance.get<OrganizationsListResponse>(url);
  return response.data;
}

export default function useGetFuelStations(params?: GetFuelStationsParams) {
  return useQuery({
    queryKey: ["fuel-stations", params],
    queryFn: () => getFuelStations(params),
  });
}
