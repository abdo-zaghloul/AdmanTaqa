import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { ServiceCategory, ServiceCategoryResponse } from "@/types/serviceCategory";
import { normalizeServiceCategory } from "./utils";

const getServiceCategoryById = async (id: number | string): Promise<ServiceCategory> => {
  try {
    const response = await axiosInstance.get<ServiceCategoryResponse>(
      `service-categories/${id}`
    );
    const category = normalizeServiceCategory(response.data?.data ?? response.data);
    if (!category) {
      throw new Error("Service category not found.");
    }
    return category;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to fetch service category.";
    throw new Error(message);
  }
};

export default function useGetServiceCategoryById(
  id: number | string | null | undefined
) {
  return useQuery({
    queryKey: ["service-category", id],
    queryFn: () => getServiceCategoryById(id!),
    enabled: id != null && id !== "",
  });
}
