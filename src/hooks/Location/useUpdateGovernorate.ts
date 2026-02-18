import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Governorate } from "@/types/location";

export interface UpdateGovernorateBody {
  name?: string;
  code?: string;
}

interface ApiResponse {
  success: boolean;
  data: Governorate;
}

const updateGovernorate = async ({
  id,
  body,
}: {
  id: number;
  body: UpdateGovernorateBody;
}): Promise<ApiResponse> => {
  const response = await axiosInstance.patch<ApiResponse>(
    `locations/governorates/${id}`,
    body
  );
  return response.data;
};

export default function useUpdateGovernorate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGovernorate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
    },
  });
}
