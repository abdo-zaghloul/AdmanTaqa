import axiosInstance from "@/api/config";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export interface DeleteAccountBody {
  password: string;
}

const deleteAccount = async (userId: number | string, body: DeleteAccountBody) => {
  try {
    const response = await axiosInstance.post(`users/${userId}/delete-account`, body);
    return response.data;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
          ? err.message
          : "Failed to delete account.";
    throw new Error(message);
  }
};

export default function useDeleteAccount() {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: ({ userId, password }: { userId: number | string; password: string }) =>
      deleteAccount(userId, { password }),
    onSuccess: () => {
      logout();
      window.location.hash = "#/login";
    },
  });
}
