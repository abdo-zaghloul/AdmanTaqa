import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { AuditListResponse } from "@/types/audit";

const getAuditLogs = async (page = 1, limit = 50) => {
  try {
    const response = await axiosInstance.get<AuditListResponse>(
      `audit?page=${page}&limit=${limit}`
    );
    return response.data.data;
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to fetch audit logs.";
    throw new Error(message);
  }
};

export default function useGetAuditLogs(page = 1, limit = 50) {
  return useQuery({
    queryKey: ["audit-logs", page, limit],
    queryFn: () => getAuditLogs(page, limit),
  });
}
