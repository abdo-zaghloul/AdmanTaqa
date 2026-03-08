import axiosInstance from "@/api/config";
import type { OrganizationMeFullResponse } from "@/types/organization";
import { useQuery } from "@tanstack/react-query";

const getOrganizationFull = async (): Promise<OrganizationMeFullResponse> => {
  const response = await axiosInstance.get<OrganizationMeFullResponse>("organizations/me/full");
  return response.data;
};

export default function useGetOrganizationFull() {
  return useQuery({
    queryKey: ["organization", "full"],
    queryFn: getOrganizationFull,
  });
}
