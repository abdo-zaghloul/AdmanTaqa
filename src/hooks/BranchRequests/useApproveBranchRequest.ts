import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const approveBranchRequest = async (id: number | string) => {
  try {
    const response = await axiosInstance.post(`branch-requests/${id}/approve`);
    return response.data;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to approve branch request.";
    throw new Error(message);
  }
};

export default function useApproveBranchRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveBranchRequest,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["branch-requests"] });
      queryClient.invalidateQueries({ queryKey: ["branch-request", id] });
    },
  });
}
