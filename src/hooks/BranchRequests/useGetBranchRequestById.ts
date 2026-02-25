import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { BranchRequestItem, BranchRequestResponse } from "@/types/branchRequest";
import { normalizeBranchRequest } from "./utils";

const getBranchRequestById = async (
  id: number | string
): Promise<BranchRequestItem> => {
  try {
    const response = await axiosInstance.get<BranchRequestResponse>(
      `branch-requests/${id}`
    );
    const item = normalizeBranchRequest(response.data?.data ?? response.data);
    if (!item) {
      throw new Error("Branch request not found.");
    }
    return item;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to fetch branch request details.";
    throw new Error(message);
  }
};

export default function useGetBranchRequestById(
  id: number | string | null | undefined
) {
  return useQuery({
    queryKey: ["branch-request", id],
    queryFn: () => getBranchRequestById(id!),
    enabled: id != null && id !== "",
  });
}
