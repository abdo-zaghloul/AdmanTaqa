import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateBranchRequestBody } from "@/types/branchRequest";

const createBranchRequest = async (body: CreateBranchRequestBody) => {
  try {
    const response = await axiosInstance.post("branch-requests", body);
    return response.data;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to submit branch request.";
    throw new Error(message);
  }
};

export default function useCreateBranchRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBranchRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch-requests"] });
    },
  });
}
