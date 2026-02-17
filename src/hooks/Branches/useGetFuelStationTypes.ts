import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";

export interface FuelStationTypeItem {
  id: number;
  name: string;
  code: string;
}

interface FuelStationTypesApiResponse {
  success: boolean;
  data: FuelStationTypeItem[];
}

const getFuelStationTypes = async (): Promise<FuelStationTypeItem[]> => {
  const response = await axiosInstance.get<FuelStationTypesApiResponse>("fuel-station-types");
  return response.data?.data ?? [];
};

export default function useGetFuelStationTypes() {
  return useQuery({
    queryKey: ["fuel-station-types"],
    queryFn: getFuelStationTypes,
  });
}
