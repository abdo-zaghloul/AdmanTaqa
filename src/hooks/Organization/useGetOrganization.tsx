import axiosInstance from '@/api/config';
import type { OrganizationResponse } from '@/types/organization';
import { useQuery } from '@tanstack/react-query';


const getOrganization = async (): Promise<OrganizationResponse> => {

  try {
    const response = await axiosInstance.get("organizations/me");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching organization:", error.response?.data || error.message);
    throw error;
  }
};

export default function useGetOrganization() {
  return (
    useQuery({
      queryKey: ["organization"],
      queryFn: () => getOrganization(),
    })
  )
}
