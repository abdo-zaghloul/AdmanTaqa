import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateServiceCategoryBody } from "@/types/serviceCategory";

const createServiceCategory = async (body: CreateServiceCategoryBody) => {
  try {
    const response = await axiosInstance.post("service-categories", body);
    return response.data;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to create service category.";
    throw new Error(message);
  }
};

export default function useCreateServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createServiceCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-categories"] });
    },
  });
}
