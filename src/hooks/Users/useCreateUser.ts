import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateUserBody } from "@/types/user";

const createUser = async (body: CreateUserBody) => {
  const response = await axiosInstance.post("users", body);
  return response.data;
};

export default function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
