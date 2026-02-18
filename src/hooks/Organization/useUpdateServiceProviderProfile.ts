import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ServiceProviderProfileBody, ServiceProviderProfileResponse } from "@/types/organization";

const updateServiceProviderProfile = async (
  organizationId: number | string,
  body: ServiceProviderProfileBody
) => {
  const response = await axiosInstance.patch<ServiceProviderProfileResponse>(
    `organizations/${organizationId}/service-provider-profile`,
    body
  );
  return response.data;
};

export default function useUpdateServiceProviderProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { organizationId: number | string; body: ServiceProviderProfileBody }) =>
      updateServiceProviderProfile(params.organizationId, params.body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["serviceProviderProfile", variables.organizationId],
      });
      queryClient.invalidateQueries({ queryKey: ["organization"] });
    },
  });
}
