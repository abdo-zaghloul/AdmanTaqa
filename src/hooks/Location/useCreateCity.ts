import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { City } from "@/types/location";

export interface CreateCityBody {
  name: string;
  code?: string;
}

interface ApiResponse {
  success: boolean;
  data: City;
}

const createCity = async (
  governorateId: number,
  body: CreateCityBody
): Promise<ApiResponse> => {
  const response = await axiosInstance.post<ApiResponse>(
    `locations/governorates/${governorateId}/cities`,
    body
  );
  return response.data;
};

export default function useCreateCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ governorateId, body }: { governorateId: number; body: CreateCityBody }) =>
      createCity(governorateId, body),
    onSuccess: (_, { governorateId }) => {
      queryClient.invalidateQueries({ queryKey: ["cities", governorateId] });
    },
  });
}
