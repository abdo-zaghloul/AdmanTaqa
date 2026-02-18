import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApproveOrganizationBody } from "@/types/organization";

const approveOrganization = async (
  id: number | string,
  body: ApproveOrganizationBody
) => {
  const response = await axiosInstance.post(`organizations/${id}/approve`, body);
  return response.data;
};

export default function useApproveOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: ApproveOrganizationBody }) =>
      approveOrganization(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["organization", id] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
