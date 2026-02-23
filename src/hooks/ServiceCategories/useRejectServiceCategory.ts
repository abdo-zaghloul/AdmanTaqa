import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RejectServiceCategoryBody } from "@/types/serviceCategory";

const rejectServiceCategory = async ({
  id,
  body,
}: {
  id: number | string;
  body?: RejectServiceCategoryBody;
}) => {
  try {
    const response = await axiosInstance.patch(`service-categories/${id}/reject`, body);
    return response.data;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to reject service category.";
    throw new Error(message);
  }
};

export default function useRejectServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectServiceCategory,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["service-categories"] });
      queryClient.invalidateQueries({
        queryKey: ["service-category", variables.id],
      });
    },
  });
}
