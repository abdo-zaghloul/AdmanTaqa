import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { City } from "@/types/location";

export interface UpdateCityBody {
  name?: string;
  code?: string;
}

interface ApiResponse {
  success: boolean;
  data: City;
}

const updateCity = async ({
  id,
  body,
}: {
  id: number;
  body: UpdateCityBody;
}): Promise<ApiResponse> => {
  const response = await axiosInstance.patch<ApiResponse>(`locations/cities/${id}`, body);
  return response.data;
};

export default function useUpdateCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });
}
