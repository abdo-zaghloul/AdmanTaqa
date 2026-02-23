import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const approveServiceCategory = async (id: number | string) => {
  try {
    const response = await axiosInstance.patch(`service-categories/${id}/approve`);
    return response.data;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to approve service category.";
    throw new Error(message);
  }
};

export default function useApproveServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveServiceCategory,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["service-categories"] });
      queryClient.invalidateQueries({ queryKey: ["service-category", id] });
    },
  });
}
