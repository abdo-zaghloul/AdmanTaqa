import axiosInstance from "@/api/config";
import type {
  JobOrderApiItem,
  JobOrderListResponse,
  JobOrderDetailResponse,
  JobOrderRow,
  JobOrderDetailView,
} from "@/types/jobOrder";

function mapItemToRow(item: JobOrderApiItem): JobOrderRow {
  const title =
    item.ServiceRequest?.formData?.description ||
    `Job Order #${item.id}`;
  const provider = item.Quotation?.Organization?.name ?? "—";
  const branch =
    item.ServiceRequest?.Branch?.nameEn ??
    item.ServiceRequest?.Branch?.nameAr ??
    "—";
  const startDate =
    item.executionDetails?.startDate ??
    (item.createdAt ? item.createdAt.slice(0, 10) : "—");
  const endDate = item.executionDetails?.endDate ?? "—";

  return {
    id: String(item.id),
    title,
    provider,
    branch,
    startDate,
    endDate,
    status: item.status ?? "—",
  };
}

export function mapItemToDetailView(item: JobOrderApiItem): JobOrderDetailView {
  const title =
    item.ServiceRequest?.formData?.description ||
    `Job Order #${item.id}`;
  const provider = item.Quotation?.Organization?.name ?? "—";
  const branch =
    item.ServiceRequest?.Branch?.nameEn ??
    item.ServiceRequest?.Branch?.nameAr ??
    "—";
  const startDate =
    item.executionDetails?.startDate ??
    (item.createdAt ? item.createdAt.slice(0, 10) : "");
  const endDate = item.executionDetails?.endDate ?? "";
  const description =
    typeof item.ServiceRequest?.formData?.description === "string"
      ? item.ServiceRequest.formData.description
      : "";
  const requestedBy = item.ServiceRequest?.User?.fullName ?? "—";
  const executionDetails = item.executionDetails as Record<string, unknown> | undefined;
  const jobType =
    typeof executionDetails?.jobType === "string"
      ? executionDetails.jobType
      : "—";
  const priority =
    typeof executionDetails?.priority === "string"
      ? executionDetails.priority
      : "MEDIUM";
  const assignedTeam =
    typeof executionDetails?.assignedTeam === "string"
      ? executionDetails.assignedTeam
      : "—";
  const estimatedCost =
    typeof executionDetails?.estimatedCost === "number"
      ? executionDetails.estimatedCost
      : null;

  return {
    id: String(item.id),
    title,
    provider,
    branch,
    status: item.status ?? "—",
    startDate,
    endDate,
    description,
    requestedBy,
    createdAt: item.createdAt ?? "",
    jobType,
    priority,
    assignedTeam,
    estimatedCost,
  };
}

export interface GetJobOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
}

export async function fetchJobOrders(
  params?: GetJobOrdersParams
): Promise<{ items: JobOrderRow[]; total: number; page: number; limit: number }> {
  const res = await axiosInstance.get<JobOrderListResponse>("job-orders", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
      ...(params?.status ? { status: params.status } : {}),
    },
  });

  const data = res.data?.data;
  const rawItems: JobOrderApiItem[] = data?.items ?? [];
  const items = rawItems.map(mapItemToRow);

  return {
    items,
    total: data?.total ?? items.length,
    page: data?.page ?? params?.page ?? 1,
    limit: data?.limit ?? params?.limit ?? 20,
  };
}

export async function fetchJobOrderById(
  id: number | string
): Promise<JobOrderDetailView | null> {
  const res = await axiosInstance.get<JobOrderDetailResponse>(
    `job-orders/${id}`
  );
  const item = res.data?.data;
  if (!item) return null;
  return mapItemToDetailView(item);
}
