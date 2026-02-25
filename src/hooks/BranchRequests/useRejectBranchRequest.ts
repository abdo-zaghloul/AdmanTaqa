import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RejectBranchRequestBody } from "@/types/branchRequest";

const rejectBranchRequest = async ({
  id,
  body,
}: {
  id: number | string;
  body?: RejectBranchRequestBody;
}) => {
  try {
    const response = await axiosInstance.post(`branch-requests/${id}/reject`, body);
    return response.data;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to reject branch request.";
    throw new Error(message);
  }
};

export default function useRejectBranchRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectBranchRequest,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["branch-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["branch-request", variables.id],
      });
    },
  });
}
