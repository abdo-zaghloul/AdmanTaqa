import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteUser = async (id: number | string) => {
  try {
    const response = await axiosInstance.delete(`users/${id}`);
    return response.data;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
          ? err.message
          : "Failed to delete user.";
    throw new Error(message);
  }
};

export default function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
