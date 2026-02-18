import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Area } from "@/types/location";

export interface CreateAreaBody {
  name: string;
  code?: string;
}

interface ApiResponse {
  success: boolean;
  data: Area;
}

const createArea = async (
  cityId: number,
  body: CreateAreaBody
): Promise<ApiResponse> => {
  const response = await axiosInstance.post<ApiResponse>(
    `locations/cities/${cityId}/areas`,
    body
  );
  return response.data;
};

export default function useCreateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cityId, body }: { cityId: number; body: CreateAreaBody }) =>
      createArea(cityId, body),
    onSuccess: (_, { cityId }) => {
      queryClient.invalidateQueries({ queryKey: ["areas", cityId] });
    },
  });
}
