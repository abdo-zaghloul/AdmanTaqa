import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Area } from "@/types/location";

export interface UpdateAreaBody {
  name?: string;
  code?: string;
}

interface ApiResponse {
  success: boolean;
  data: Area;
}

const updateArea = async ({
  id,
  body,
}: {
  id: number;
  body: UpdateAreaBody;
}): Promise<ApiResponse> => {
  const response = await axiosInstance.patch<ApiResponse>(`locations/areas/${id}`, body);
  return response.data;
};

export default function useUpdateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
}
