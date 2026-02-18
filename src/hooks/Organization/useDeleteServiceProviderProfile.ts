import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteServiceProviderProfile = async (organizationId: number | string) => {
  await axiosInstance.delete(
    `organizations/${organizationId}/service-provider-profile`
  );
};

export default function useDeleteServiceProviderProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteServiceProviderProfile,
    onSuccess: (_, organizationId) => {
      queryClient.invalidateQueries({
        queryKey: ["serviceProviderProfile", organizationId],
      });
      queryClient.invalidateQueries({ queryKey: ["organization"] });
    },
  });
}
