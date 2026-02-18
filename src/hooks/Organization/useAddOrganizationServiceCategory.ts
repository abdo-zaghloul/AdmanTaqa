import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addOrganizationServiceCategory = async (
  organizationId: number,
  categoryId: number
) => {
  await axiosInstance.post(`organizations/${organizationId}/service-categories`, {
    categoryId,
  });
};

export default function useAddOrganizationServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      categoryId,
    }: { organizationId: number; categoryId: number }) =>
      addOrganizationServiceCategory(organizationId, categoryId),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "service-categories"],
      });
      queryClient.invalidateQueries({ queryKey: ["organization"] });
    },
  });
}
