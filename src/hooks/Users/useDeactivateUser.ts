import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deactivateUser = async (id: number | string) => {
  try {
    const response = await axiosInstance.patch(`team/users/${id}/deactivate`);
    return response.data;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
          ? err.message
          : "Failed to deactivate user.";
    throw new Error(message);
  }
};

export default function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deactivateUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", String(id)] });
    },
  });
}
