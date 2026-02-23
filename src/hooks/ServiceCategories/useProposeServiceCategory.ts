import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProposeServiceCategoryBody } from "@/types/serviceCategory";

const proposeServiceCategory = async (body: ProposeServiceCategoryBody) => {
  try {
    const response = await axiosInstance.post("service-categories/propose", body);
    return response.data;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to propose service category.";
    throw new Error(message);
  }
};

export default function useProposeServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: proposeServiceCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-categories"] });
    },
  });
}
