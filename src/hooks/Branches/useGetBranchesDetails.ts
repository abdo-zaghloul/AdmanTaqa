import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { BranchApiItem } from "./useGetBranches";

interface BranchDetailApiResponse {
  success: boolean;
  data: BranchApiItem;
}

const getBranchesDetails = async (id: number | string): Promise<BranchApiItem | null> => {
  try {
    const response = await axiosInstance.get<BranchDetailApiResponse>(`branches/${id}`);
    return response.data?.data ?? null;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error fetching branch details:", err.response?.data ?? err.message);
    throw error;
  }
};

export default function useGetBranchesDetails(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["branches", id],
    queryFn: () => getBranchesDetails(id!),
    enabled: !!id,
  });
}
