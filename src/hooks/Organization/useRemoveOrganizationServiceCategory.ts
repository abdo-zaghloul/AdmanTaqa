import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const removeOrganizationServiceCategory = async (
  organizationId: number,
  categoryId: number
) => {
  await axiosInstance.delete(
    `organizations/${organizationId}/service-categories/${categoryId}`
  );
};

export default function useRemoveOrganizationServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      categoryId,
    }: { organizationId: number; categoryId: number }) =>
      removeOrganizationServiceCategory(organizationId, categoryId),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "service-categories"],
      });
      queryClient.invalidateQueries({ queryKey: ["organization"] });
    },
  });
}
