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
    item.Branch?.nameEn ??
    item.Branch?.nameAr ??
    item.ServiceRequest?.Branch?.nameEn ??
    item.ServiceRequest?.Branch?.nameAr ??
    "—";
  const startDate =
    item.executionDetails?.startDate ??
    item.executionDetails?.scheduledDate ??
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
    item.Branch?.nameEn ??
    item.Branch?.nameAr ??
    item.ServiceRequest?.Branch?.nameEn ??
    item.ServiceRequest?.Branch?.nameAr ??
    "—";
  const startDate =
    item.executionDetails?.startDate ??
    item.executionDetails?.scheduledDate ??
    (item.createdAt ? item.createdAt.slice(0, 10) : "");
  const endDate =
    (item.expectedEndDate && item.expectedEndDate !== null
      ? item.expectedEndDate
      : item.executionDetails?.endDate) ?? "";
  const description =
    typeof item.ServiceRequest?.formData?.description === "string"
      ? item.ServiceRequest.formData.description
      : "";
  const requestedBy =
    item.ServiceRequest?.RequestedByUser?.fullName ??
    item.ServiceRequest?.User?.fullName ??
    "—";
  const executionDetails = item.executionDetails as Record<string, unknown> | undefined;
  const jobType =
    typeof item.jobType === "string" && item.jobType
      ? item.jobType
      : typeof executionDetails?.jobType === "string"
        ? executionDetails.jobType
        : "—";
  const priorityRaw =
    typeof executionDetails?.priority === "string"
      ? executionDetails.priority
      : typeof item.ServiceRequest?.formData?.priority === "string"
        ? item.ServiceRequest.formData.priority
        : "MEDIUM";
  const priority = priorityRaw.toUpperCase();
  // const assignedTeam =
  //   typeof executionDetails?.assignedTeam === "string"
  //     ? executionDetails.assignedTeam
  //     : "—";
  const estimatedCost =
    typeof executionDetails?.estimatedCost === "number"
      ? executionDetails.estimatedCost
      : null;
  const fuelStationName = item.ServiceRequest?.Organization?.name ?? undefined;
  const area = item.ServiceRequest?.Area?.name ?? undefined;
  const city = item.ServiceRequest?.City?.name ?? undefined;

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
    estimatedCost,
    fuelStationName,
    area,
    city,
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
  const rawItems: JobOrderApiItem[] = Array.isArray(data)
    ? data
    : (data && typeof data === "object" && "items" in data ? (data as { items: JobOrderApiItem[] }).items : []);
  const items = rawItems.map(mapItemToRow);
  const paginated = data && typeof data === "object" && "total" in data ? (data as { total: number; page: number; limit: number }) : null;

  return {
    items,
    total: paginated?.total ?? items.length,
    page: paginated?.page ?? params?.page ?? 1,
    limit: paginated?.limit ?? params?.limit ?? 20,
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

/** GET /api/job-orders/review-queue — job orders awaiting payment confirmation (Service Provider) */
export async function fetchJobOrderReviewQueue(params?: {
  page?: number;
  limit?: number;
}): Promise<{ items: JobOrderRow[]; total: number; page: number; limit: number }> {
  const res = await axiosInstance.get<JobOrderListResponse>("job-orders/review-queue", {
    params: { page: params?.page ?? 1, limit: params?.limit ?? 20 },
  });
  const data = res.data?.data;
  const rawItems: JobOrderApiItem[] = Array.isArray(data)
    ? data
    : (data && typeof data === "object" && "items" in data ? (data as { items: JobOrderApiItem[] }).items : []);
  const items = rawItems.map(mapItemToRow);
  const paginated = data && typeof data === "object" && "total" in data ? (data as { total: number; page: number; limit: number }) : null;
  return {
    items,
    total: paginated?.total ?? items.length,
    page: paginated?.page ?? params?.page ?? 1,
    limit: paginated?.limit ?? params?.limit ?? 20,
  };
}
