import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { OrganizationApprovalHistoryResponse } from "@/types/organization";

const getOrganizationApprovalHistory = async (organizationId: number) => {
  const response = await axiosInstance.get<OrganizationApprovalHistoryResponse>(
    `organizations/${organizationId}/approval-history`
  );
  return response.data?.data ?? [];
};

export default function useGetOrganizationApprovalHistory(
  organizationId: number | null | undefined
) {
  return useQuery({
    queryKey: ["organization", organizationId, "approval-history"],
    queryFn: () => getOrganizationApprovalHistory(organizationId!),
    enabled: organizationId != null && organizationId > 0,
  });
}
