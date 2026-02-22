import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateUserBody, UserDetailResponse } from "@/types/user";

const updateUser = async (id: number | string, body: UpdateUserBody) => {
  try {
    const response = await axiosInstance.patch<UserDetailResponse>(`users/${id}`, body);
    return response.data;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
          ? err.message
          : "Failed to update user.";
    throw new Error(message);
  }
};

export default function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: UpdateUserBody }) =>
      updateUser(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
