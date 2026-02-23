import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { ServiceOfferingResponse } from "@/types/organization";

const getServiceOfferingById = async (
  organizationId: number | string,
  offeringId: number | string
) => {
  const response = await axiosInstance.get<ServiceOfferingResponse>(
    `organizations/${organizationId}/service-offerings/${offeringId}`
  );
  return response.data;
};

export default function useGetServiceOfferingById(
  organizationId: number | string | null | undefined,
  offeringId: number | string | null | undefined
) {
  return useQuery({
    queryKey: ["service-offering", organizationId, offeringId],
    queryFn: () => getServiceOfferingById(organizationId!, offeringId!),
    enabled:
      organizationId != null &&
      organizationId !== "" &&
      offeringId != null &&
      offeringId !== "",
  });
}
