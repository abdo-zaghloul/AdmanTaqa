import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { ServiceCategory } from "@/types/organization";

interface ServiceCategoriesListResponse {
  success: boolean;
  data: ServiceCategory[];
  message?: string;
}

const getServiceCategories = async (): Promise<ServiceCategory[]> => {
  const response = await axiosInstance.get<ServiceCategoriesListResponse>("service-categories");
  return response.data?.data ?? [];
};

export default function useGetServiceCategories() {
  return useQuery({
    queryKey: ["service-categories"],
    queryFn: getServiceCategories,
  });
}
