import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Country } from "@/types/location";

export interface CreateCountryBody {
  name: string;
  code?: string;
}

interface ApiResponse {
  success: boolean;
  data: Country;
}

const createCountry = async (body: CreateCountryBody): Promise<ApiResponse> => {
  const response = await axiosInstance.post<ApiResponse>("locations/countries", body);
  return response.data;
};

export default function useCreateCountry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
  });
}
