import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateServiceCategoryBody } from "@/types/serviceCategory";

const updateServiceCategory = async ({
  id,
  body,
}: {
  id: number | string;
  body: UpdateServiceCategoryBody;
}) => {
  try {
    const response = await axiosInstance.patch(`service-categories/${id}`, body);
    return response.data;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to update service category.";
    throw new Error(message);
  }
};

export default function useUpdateServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateServiceCategory,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["service-categories"] });
      queryClient.invalidateQueries({
        queryKey: ["service-category", variables.id],
      });
    },
  });
}
