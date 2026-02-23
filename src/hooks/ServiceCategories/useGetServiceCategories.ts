import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type {
  ServiceCategory,
  ServiceCategoriesListResponse,
} from "@/types/serviceCategory";
import { normalizeServiceCategoriesList } from "./utils";

const getServiceCategories = async (): Promise<ServiceCategory[]> => {
  try {
    const response =
      await axiosInstance.get<ServiceCategoriesListResponse>("service-categories");
    return normalizeServiceCategoriesList(response.data);
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to fetch service categories.";
    throw new Error(message);
  }
};

export default function useGetServiceCategories() {
  return useQuery({
    queryKey: ["service-categories"],
    queryFn: getServiceCategories,
  });
}
