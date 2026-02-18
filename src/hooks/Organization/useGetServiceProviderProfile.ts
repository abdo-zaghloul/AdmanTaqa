import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { ServiceProviderProfile, ServiceProviderProfileResponse } from "@/types/organization";

async function getServiceProviderProfile(
  organizationId: number | string
): Promise<ServiceProviderProfile | null> {
  try {
    const res = await axiosInstance.get<ServiceProviderProfileResponse>(
      `organizations/${organizationId}/service-provider-profile`
    );
    return res.data?.data ?? null;
  } catch (e: unknown) {
    const err = e as { response?: { status?: number } };
    if (err.response?.status === 404) return null;
    throw e;
  }
}

export default function useGetServiceProviderProfile(
  organizationId: number | string | null | undefined
) {
  return useQuery({
    queryKey: ["serviceProviderProfile", organizationId],
    queryFn: () => getServiceProviderProfile(organizationId!),
    enabled: organizationId != null && organizationId !== "",
  });
}
