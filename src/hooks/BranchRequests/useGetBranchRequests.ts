import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type {
  BranchRequestsListData,
  BranchRequestsListResponse,
  BranchRequestsQuery,
} from "@/types/branchRequest";
import { normalizeBranchRequestsList } from "./utils";

const getBranchRequests = async (
  query: BranchRequestsQuery
): Promise<BranchRequestsListData> => {
  try {
    const params: Record<string, string | number> = {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    };
    if (query.status && query.status !== "all") {
      params.status = query.status;
    }

    const response = await axiosInstance.get<BranchRequestsListResponse>(
      "branch-requests",
      { params }
    );
    return normalizeBranchRequestsList(response.data, query.page, query.limit);
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to fetch branch requests.";
    throw new Error(message);
  }
};

export default function useGetBranchRequests(query: BranchRequestsQuery) {
  return useQuery({
    queryKey: ["branch-requests", query],
    queryFn: () => getBranchRequests(query),
  });
}
