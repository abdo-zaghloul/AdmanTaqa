import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { AreaDetails } from "@/types/location";

interface AreaDetailsApiResponse {
  success: boolean;
  data: AreaDetails;
}

export const getAreaDetails = async (areaId: number | string): Promise<AreaDetails | null> => {
  const response = await axiosInstance.get<AreaDetailsApiResponse>(`locations/areas/${areaId}`);
  return response.data?.data ?? null;
};

export default function useGetAreaDetails(areaId: number | string | null | undefined) {
  return useQuery({
    queryKey: ["area", areaId],
    queryFn: () => getAreaDetails(areaId!),
    enabled: !!areaId,
  });
}
