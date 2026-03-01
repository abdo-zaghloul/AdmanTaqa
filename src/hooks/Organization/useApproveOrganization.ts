import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApproveOrganizationBody } from "@/types/organization";

const approveOrganization = async (
  id: number | string,
  body: ApproveOrganizationBody
) => {
  try {
    const response = await axiosInstance.post(`organizations/${id}/approve`, body);
    return response.data;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
          ? err.message
          : "Failed to approve organization.";
    throw new Error(message);
  }
};

export default function useApproveOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: ApproveOrganizationBody }) =>
      approveOrganization(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["organization", id] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-stations"] });
    },
  });
}
