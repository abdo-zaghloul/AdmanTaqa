import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ServiceProviderProfileBody, ServiceProviderProfileResponse } from "@/types/organization";

const createServiceProviderProfile = async (
  organizationId: number | string,
  body: ServiceProviderProfileBody
) => {
  const response = await axiosInstance.post<ServiceProviderProfileResponse>(
    `organizations/${organizationId}/service-provider-profile`,
    body
  );
  return response.data;
};

export default function useCreateServiceProviderProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { organizationId: number | string; body: ServiceProviderProfileBody }) =>
      createServiceProviderProfile(params.organizationId, params.body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["serviceProviderProfile", variables.organizationId],
      });
      queryClient.invalidateQueries({ queryKey: ["organization"] });
    },
  });
}
