import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addOrganizationServiceCategory = async (
  organizationId: number,
  categoryId: number
) => {
  try {
    await axiosInstance.post(`organizations/${organizationId}/service-categories`, {
      categoryId,
    });
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to link service category.";
    throw new Error(message);
  }
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
