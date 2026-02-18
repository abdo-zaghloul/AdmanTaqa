import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { OrganizationResponse } from "@/types/organization";

const getOrganizationById = async (id: number | string) => {
  const response = await axiosInstance.get<OrganizationResponse>(`organizations/${id}`);
  return response.data?.data ?? null;
};

export default function useGetOrganizationById(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: () => getOrganizationById(id!),
    enabled: id != null && id !== "",
  });
}
