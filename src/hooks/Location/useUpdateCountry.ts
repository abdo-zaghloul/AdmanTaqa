import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Country } from "@/types/location";

export interface UpdateCountryBody {
  name?: string;
  code?: string;
}

interface ApiResponse {
  success: boolean;
  data: Country;
}

const updateCountry = async ({
  id,
  body,
}: {
  id: number;
  body: UpdateCountryBody;
}): Promise<ApiResponse> => {
  const response = await axiosInstance.patch<ApiResponse>(`locations/countries/${id}`, body);
  return response.data;
};

export default function useUpdateCountry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
  });
}
