import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Governorate } from "@/types/location";

export interface CreateGovernorateBody {
  name: string;
  code?: string;
}

interface ApiResponse {
  success: boolean;
  data: Governorate;
}

const createGovernorate = async (
  countryId: number,
  body: CreateGovernorateBody
): Promise<ApiResponse> => {
  const response = await axiosInstance.post<ApiResponse>(
    `locations/countries/${countryId}/governorates`,
    body
  );
  return response.data;
};

export default function useCreateGovernorate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ countryId, body }: { countryId: number; body: CreateGovernorateBody }) =>
      createGovernorate(countryId, body),
    onSuccess: (_, { countryId }) => {
      queryClient.invalidateQueries({ queryKey: ["governorates", countryId] });
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
  });
}
