import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BranchApiItem } from "./useGetBranches";

export interface UpdateBranchBody {
  nameEn?: string;
  nameAr?: string;
  address?: string;
  status?: string;
  isActive?: boolean;
  fuelTypeIds?: number[];
}

interface UpdateBranchApiResponse {
  success: boolean;
  data?: BranchApiItem;
  message?: string;
}

const updateBranch = async (
  branchId: number | string,
  body: UpdateBranchBody
): Promise<UpdateBranchApiResponse> => {
  const response = await axiosInstance.patch<UpdateBranchApiResponse>(
    `branches/${branchId}`,
    body
  );
  return response.data;
};

export default function useUpdateBranch(branchId: number | string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateBranchBody) => updateBranch(branchId!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      if (branchId != null) {
        queryClient.invalidateQueries({ queryKey: ["branches", String(branchId)] });
      }
    },
  });
}
